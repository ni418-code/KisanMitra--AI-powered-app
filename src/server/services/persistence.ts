import mongoose from 'mongoose';
import { UserModel } from '../models/User.ts';
import { ProductModel } from '../models/Product.ts';
import { BuyerRequestModel } from '../models/BuyerRequest.ts';
import { OfferModel } from '../models/Offer.ts';
import { OrderModel } from '../models/Order.ts';
import { ConversationModel } from '../models/Conversation.ts';
import { NotificationModel } from '../models/Notification.ts';
import { PriceAlertModel } from '../models/PriceAlert.ts';
import { MSPModel } from '../models/MSP.ts';
import { LogisticsTaskModel } from '../models/LogisticsTask.ts';
import { isDbConnected } from '../config/db.ts';
import { OFFICIAL_MSP_DATA } from './mspService.ts';

/**
 * Best-effort MongoDB persistence bridge.
 *
 * The application always runs against the in-memory `dataStore`, which keeps
 * every request fast and lets the app boot with zero configuration. When a
 * MongoDB Atlas connection is available, this module:
 *   1. hydrates the in-memory store from the database on boot, and
 *   2. mirrors every write back to the database (fire-and-forget).
 *
 * Every call is wrapped so a database failure can never break a request — the
 * app degrades to the in-memory store instead.
 */

type AnyModel = mongoose.Model<any>;

const COLLECTIONS: Record<string, AnyModel> = {
  users: UserModel as unknown as AnyModel,
  products: ProductModel as unknown as AnyModel,
  buyerRequests: BuyerRequestModel as unknown as AnyModel,
  offers: OfferModel as unknown as AnyModel,
  orders: OrderModel as unknown as AnyModel,
  conversations: ConversationModel as unknown as AnyModel,
  notifications: NotificationModel as unknown as AnyModel,
  alerts: PriceAlertModel as unknown as AnyModel,
  logisticsTasks: LogisticsTaskModel as unknown as AnyModel,
};

/** Convert a Mongo document into the plain JSON shape the app/API expects. */
function toPlain(doc: any): any {
  if (!doc) return doc;
  const obj = typeof doc.toObject === 'function' ? doc.toObject({ versionKey: false }) : { ...doc };
  delete obj._id;
  delete obj.__v;

  const walk = (value: any): any => {
    if (value instanceof Date) return value.toISOString();
    if (Array.isArray(value)) return value.map(walk);
    if (value && typeof value === 'object') {
      // Mongo ObjectId / Decimal128 etc. expose toString()
      if (value.constructor && /ObjectId|Decimal|Binary/i.test(value.constructor.name)) {
        return value.toString();
      }
      const out: Record<string, any> = {};
      for (const [k, v] of Object.entries(value)) out[k] = walk(v);
      return out;
    }
    return value;
  };

  return walk(obj);
}

function keyFor(kind: string): string {
  return kind === 'users' ? 'userId' : 'id';
}

export class Persistence {
  static isEnabled(): boolean {
    return isDbConnected();
  }

  /**
   * Load everything from MongoDB into the in-memory store.
   * A collection is only replaced when the database actually has documents,
   * so the seeded demo data survives on a fresh / empty cluster.
   */
  static async hydrate(store: Record<string, any[]>): Promise<void> {
    if (!Persistence.isEnabled()) return;

    try {
      for (const [kind, model] of Object.entries(COLLECTIONS)) {
        const docs = await model.find().lean();
        if (!Array.isArray(docs) || docs.length === 0) continue;

        const plain = docs.map(toPlain).filter((d: any) => d && (d.id || d.userId));
        if (plain.length === 0) continue;

        store[kind] = plain;
      }

      // Make sure the official MSP reference data exists in the cluster.
      for (const msp of OFFICIAL_MSP_DATA) {
        await (MSPModel as any)
          .findOneAndUpdate({ crop: msp.crop }, { $set: { id: msp.id, ...msp } }, { upsert: true, new: true })
          .catch(() => undefined);
      }

      console.log(
        `[Kisan Mitra] Hydrated from MongoDB — users:${store.users?.length ?? 0} products:${store.products?.length ?? 0} ` +
          `requests:${store.buyerRequests?.length ?? 0} offers:${store.offers?.length ?? 0} orders:${store.orders?.length ?? 0} ` +
          `conversations:${store.conversations?.length ?? 0}`
      );
    } catch (err: any) {
      console.warn('[Kisan Mitra] Hydration skipped, running on in-memory store:', err?.message || err);
    }
  }

  /**
   * Mirror a single document to MongoDB. Never awaited from request handlers.
   */
  static save(kind: string, doc: any): void {
    if (!Persistence.isEnabled() || !doc) return;
    const model = COLLECTIONS[kind];
    if (!model) return;

    const key = keyFor(kind);
    const id = doc[key];
    if (!id) return;

    // Never persist Mongo internals or the primary key itself.
    const { _id, __v, ...payload } = doc;

    model
      .findOneAndUpdate({ [key]: id }, { $set: payload }, { upsert: true, new: true })
      .catch((err: any) => console.warn(`[Kisan Mitra] persist ${kind} note:`, err?.message || err));
  }

  /** Delete a single document from MongoDB (best-effort). */
  static remove(kind: string, id: string): void {
    if (!Persistence.isEnabled() || !id) return;
    const model = COLLECTIONS[kind];
    if (!model) return;

    model
      .deleteOne({ [keyFor(kind)]: id })
      .catch((err: any) => console.warn(`[Kisan Mitra] delete ${kind} note:`, err?.message || err));
  }

  /** Persist every currently loaded collection (used on graceful shutdown). */
  static async flush(store: Record<string, any[]>): Promise<void> {
    if (!Persistence.isEnabled()) return;
    for (const kind of Object.keys(COLLECTIONS)) {
      for (const doc of store[kind] || []) {
        Persistence.save(kind, doc);
      }
    }
  }
}
