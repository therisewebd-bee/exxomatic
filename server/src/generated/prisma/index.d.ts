
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model VehicleInfo
 * 
 */
export type VehicleInfo = $Result.DefaultSelection<Prisma.$VehicleInfoPayload>
/**
 * Model LocationLog
 * 
 */
export type LocationLog = $Result.DefaultSelection<Prisma.$LocationLogPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Geofence
 * 
 */
export type Geofence = $Result.DefaultSelection<Prisma.$GeofencePayload>
/**
 * Model VehiclesOnGeofences
 * 
 */
export type VehiclesOnGeofences = $Result.DefaultSelection<Prisma.$VehiclesOnGeofencesPayload>
/**
 * Model VehicleCompliance
 * 
 */
export type VehicleCompliance = $Result.DefaultSelection<Prisma.$VehicleCompliancePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const userRole: {
  Admin: 'Admin',
  Customer: 'Customer'
};

export type userRole = (typeof userRole)[keyof typeof userRole]

}

export type userRole = $Enums.userRole

export const userRole: typeof $Enums.userRole

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more VehicleInfos
 * const vehicleInfos = await prisma.vehicleInfo.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more VehicleInfos
   * const vehicleInfos = await prisma.vehicleInfo.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.vehicleInfo`: Exposes CRUD operations for the **VehicleInfo** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VehicleInfos
    * const vehicleInfos = await prisma.vehicleInfo.findMany()
    * ```
    */
  get vehicleInfo(): Prisma.VehicleInfoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.locationLog`: Exposes CRUD operations for the **LocationLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LocationLogs
    * const locationLogs = await prisma.locationLog.findMany()
    * ```
    */
  get locationLog(): Prisma.LocationLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.geofence`: Exposes CRUD operations for the **Geofence** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Geofences
    * const geofences = await prisma.geofence.findMany()
    * ```
    */
  get geofence(): Prisma.GeofenceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.vehiclesOnGeofences`: Exposes CRUD operations for the **VehiclesOnGeofences** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VehiclesOnGeofences
    * const vehiclesOnGeofences = await prisma.vehiclesOnGeofences.findMany()
    * ```
    */
  get vehiclesOnGeofences(): Prisma.VehiclesOnGeofencesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.vehicleCompliance`: Exposes CRUD operations for the **VehicleCompliance** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VehicleCompliances
    * const vehicleCompliances = await prisma.vehicleCompliance.findMany()
    * ```
    */
  get vehicleCompliance(): Prisma.VehicleComplianceDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.5.0
   * Query Engine version: 280c870be64f457428992c43c1f6d557fab6e29e
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    VehicleInfo: 'VehicleInfo',
    LocationLog: 'LocationLog',
    User: 'User',
    Geofence: 'Geofence',
    VehiclesOnGeofences: 'VehiclesOnGeofences',
    VehicleCompliance: 'VehicleCompliance'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "vehicleInfo" | "locationLog" | "user" | "geofence" | "vehiclesOnGeofences" | "vehicleCompliance"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      VehicleInfo: {
        payload: Prisma.$VehicleInfoPayload<ExtArgs>
        fields: Prisma.VehicleInfoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VehicleInfoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleInfoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VehicleInfoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleInfoPayload>
          }
          findFirst: {
            args: Prisma.VehicleInfoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleInfoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VehicleInfoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleInfoPayload>
          }
          findMany: {
            args: Prisma.VehicleInfoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleInfoPayload>[]
          }
          create: {
            args: Prisma.VehicleInfoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleInfoPayload>
          }
          createMany: {
            args: Prisma.VehicleInfoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VehicleInfoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleInfoPayload>[]
          }
          delete: {
            args: Prisma.VehicleInfoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleInfoPayload>
          }
          update: {
            args: Prisma.VehicleInfoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleInfoPayload>
          }
          deleteMany: {
            args: Prisma.VehicleInfoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VehicleInfoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VehicleInfoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleInfoPayload>[]
          }
          upsert: {
            args: Prisma.VehicleInfoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleInfoPayload>
          }
          aggregate: {
            args: Prisma.VehicleInfoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVehicleInfo>
          }
          groupBy: {
            args: Prisma.VehicleInfoGroupByArgs<ExtArgs>
            result: $Utils.Optional<VehicleInfoGroupByOutputType>[]
          }
          count: {
            args: Prisma.VehicleInfoCountArgs<ExtArgs>
            result: $Utils.Optional<VehicleInfoCountAggregateOutputType> | number
          }
        }
      }
      LocationLog: {
        payload: Prisma.$LocationLogPayload<ExtArgs>
        fields: Prisma.LocationLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LocationLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LocationLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationLogPayload>
          }
          findFirst: {
            args: Prisma.LocationLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LocationLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationLogPayload>
          }
          findMany: {
            args: Prisma.LocationLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationLogPayload>[]
          }
          create: {
            args: Prisma.LocationLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationLogPayload>
          }
          createMany: {
            args: Prisma.LocationLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LocationLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationLogPayload>[]
          }
          delete: {
            args: Prisma.LocationLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationLogPayload>
          }
          update: {
            args: Prisma.LocationLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationLogPayload>
          }
          deleteMany: {
            args: Prisma.LocationLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LocationLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LocationLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationLogPayload>[]
          }
          upsert: {
            args: Prisma.LocationLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationLogPayload>
          }
          aggregate: {
            args: Prisma.LocationLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLocationLog>
          }
          groupBy: {
            args: Prisma.LocationLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<LocationLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.LocationLogCountArgs<ExtArgs>
            result: $Utils.Optional<LocationLogCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Geofence: {
        payload: Prisma.$GeofencePayload<ExtArgs>
        fields: Prisma.GeofenceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GeofenceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeofencePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GeofenceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeofencePayload>
          }
          findFirst: {
            args: Prisma.GeofenceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeofencePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GeofenceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeofencePayload>
          }
          findMany: {
            args: Prisma.GeofenceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeofencePayload>[]
          }
          create: {
            args: Prisma.GeofenceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeofencePayload>
          }
          createMany: {
            args: Prisma.GeofenceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GeofenceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeofencePayload>[]
          }
          delete: {
            args: Prisma.GeofenceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeofencePayload>
          }
          update: {
            args: Prisma.GeofenceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeofencePayload>
          }
          deleteMany: {
            args: Prisma.GeofenceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GeofenceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GeofenceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeofencePayload>[]
          }
          upsert: {
            args: Prisma.GeofenceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeofencePayload>
          }
          aggregate: {
            args: Prisma.GeofenceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGeofence>
          }
          groupBy: {
            args: Prisma.GeofenceGroupByArgs<ExtArgs>
            result: $Utils.Optional<GeofenceGroupByOutputType>[]
          }
          count: {
            args: Prisma.GeofenceCountArgs<ExtArgs>
            result: $Utils.Optional<GeofenceCountAggregateOutputType> | number
          }
        }
      }
      VehiclesOnGeofences: {
        payload: Prisma.$VehiclesOnGeofencesPayload<ExtArgs>
        fields: Prisma.VehiclesOnGeofencesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VehiclesOnGeofencesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclesOnGeofencesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VehiclesOnGeofencesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclesOnGeofencesPayload>
          }
          findFirst: {
            args: Prisma.VehiclesOnGeofencesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclesOnGeofencesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VehiclesOnGeofencesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclesOnGeofencesPayload>
          }
          findMany: {
            args: Prisma.VehiclesOnGeofencesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclesOnGeofencesPayload>[]
          }
          create: {
            args: Prisma.VehiclesOnGeofencesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclesOnGeofencesPayload>
          }
          createMany: {
            args: Prisma.VehiclesOnGeofencesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VehiclesOnGeofencesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclesOnGeofencesPayload>[]
          }
          delete: {
            args: Prisma.VehiclesOnGeofencesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclesOnGeofencesPayload>
          }
          update: {
            args: Prisma.VehiclesOnGeofencesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclesOnGeofencesPayload>
          }
          deleteMany: {
            args: Prisma.VehiclesOnGeofencesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VehiclesOnGeofencesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VehiclesOnGeofencesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclesOnGeofencesPayload>[]
          }
          upsert: {
            args: Prisma.VehiclesOnGeofencesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclesOnGeofencesPayload>
          }
          aggregate: {
            args: Prisma.VehiclesOnGeofencesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVehiclesOnGeofences>
          }
          groupBy: {
            args: Prisma.VehiclesOnGeofencesGroupByArgs<ExtArgs>
            result: $Utils.Optional<VehiclesOnGeofencesGroupByOutputType>[]
          }
          count: {
            args: Prisma.VehiclesOnGeofencesCountArgs<ExtArgs>
            result: $Utils.Optional<VehiclesOnGeofencesCountAggregateOutputType> | number
          }
        }
      }
      VehicleCompliance: {
        payload: Prisma.$VehicleCompliancePayload<ExtArgs>
        fields: Prisma.VehicleComplianceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VehicleComplianceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleCompliancePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VehicleComplianceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleCompliancePayload>
          }
          findFirst: {
            args: Prisma.VehicleComplianceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleCompliancePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VehicleComplianceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleCompliancePayload>
          }
          findMany: {
            args: Prisma.VehicleComplianceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleCompliancePayload>[]
          }
          create: {
            args: Prisma.VehicleComplianceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleCompliancePayload>
          }
          createMany: {
            args: Prisma.VehicleComplianceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VehicleComplianceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleCompliancePayload>[]
          }
          delete: {
            args: Prisma.VehicleComplianceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleCompliancePayload>
          }
          update: {
            args: Prisma.VehicleComplianceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleCompliancePayload>
          }
          deleteMany: {
            args: Prisma.VehicleComplianceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VehicleComplianceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VehicleComplianceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleCompliancePayload>[]
          }
          upsert: {
            args: Prisma.VehicleComplianceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleCompliancePayload>
          }
          aggregate: {
            args: Prisma.VehicleComplianceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVehicleCompliance>
          }
          groupBy: {
            args: Prisma.VehicleComplianceGroupByArgs<ExtArgs>
            result: $Utils.Optional<VehicleComplianceGroupByOutputType>[]
          }
          count: {
            args: Prisma.VehicleComplianceCountArgs<ExtArgs>
            result: $Utils.Optional<VehicleComplianceCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    vehicleInfo?: VehicleInfoOmit
    locationLog?: LocationLogOmit
    user?: UserOmit
    geofence?: GeofenceOmit
    vehiclesOnGeofences?: VehiclesOnGeofencesOmit
    vehicleCompliance?: VehicleComplianceOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type VehicleInfoCountOutputType
   */

  export type VehicleInfoCountOutputType = {
    locations: number
    compliances: number
    geofences: number
  }

  export type VehicleInfoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    locations?: boolean | VehicleInfoCountOutputTypeCountLocationsArgs
    compliances?: boolean | VehicleInfoCountOutputTypeCountCompliancesArgs
    geofences?: boolean | VehicleInfoCountOutputTypeCountGeofencesArgs
  }

  // Custom InputTypes
  /**
   * VehicleInfoCountOutputType without action
   */
  export type VehicleInfoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleInfoCountOutputType
     */
    select?: VehicleInfoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * VehicleInfoCountOutputType without action
   */
  export type VehicleInfoCountOutputTypeCountLocationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocationLogWhereInput
  }

  /**
   * VehicleInfoCountOutputType without action
   */
  export type VehicleInfoCountOutputTypeCountCompliancesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VehicleComplianceWhereInput
  }

  /**
   * VehicleInfoCountOutputType without action
   */
  export type VehicleInfoCountOutputTypeCountGeofencesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VehiclesOnGeofencesWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    vehicleInfos: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicleInfos?: boolean | UserCountOutputTypeCountVehicleInfosArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountVehicleInfosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VehicleInfoWhereInput
  }


  /**
   * Count Type GeofenceCountOutputType
   */

  export type GeofenceCountOutputType = {
    vehicles: number
  }

  export type GeofenceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicles?: boolean | GeofenceCountOutputTypeCountVehiclesArgs
  }

  // Custom InputTypes
  /**
   * GeofenceCountOutputType without action
   */
  export type GeofenceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeofenceCountOutputType
     */
    select?: GeofenceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GeofenceCountOutputType without action
   */
  export type GeofenceCountOutputTypeCountVehiclesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VehiclesOnGeofencesWhereInput
  }


  /**
   * Models
   */

  /**
   * Model VehicleInfo
   */

  export type AggregateVehicleInfo = {
    _count: VehicleInfoCountAggregateOutputType | null
    _min: VehicleInfoMinAggregateOutputType | null
    _max: VehicleInfoMaxAggregateOutputType | null
  }

  export type VehicleInfoMinAggregateOutputType = {
    id: string | null
    imei: string | null
    vechicleNumb: string | null
    customerId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VehicleInfoMaxAggregateOutputType = {
    id: string | null
    imei: string | null
    vechicleNumb: string | null
    customerId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VehicleInfoCountAggregateOutputType = {
    id: number
    imei: number
    vechicleNumb: number
    customerId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VehicleInfoMinAggregateInputType = {
    id?: true
    imei?: true
    vechicleNumb?: true
    customerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VehicleInfoMaxAggregateInputType = {
    id?: true
    imei?: true
    vechicleNumb?: true
    customerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VehicleInfoCountAggregateInputType = {
    id?: true
    imei?: true
    vechicleNumb?: true
    customerId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VehicleInfoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VehicleInfo to aggregate.
     */
    where?: VehicleInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VehicleInfos to fetch.
     */
    orderBy?: VehicleInfoOrderByWithRelationInput | VehicleInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VehicleInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VehicleInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VehicleInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VehicleInfos
    **/
    _count?: true | VehicleInfoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VehicleInfoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VehicleInfoMaxAggregateInputType
  }

  export type GetVehicleInfoAggregateType<T extends VehicleInfoAggregateArgs> = {
        [P in keyof T & keyof AggregateVehicleInfo]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVehicleInfo[P]>
      : GetScalarType<T[P], AggregateVehicleInfo[P]>
  }




  export type VehicleInfoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VehicleInfoWhereInput
    orderBy?: VehicleInfoOrderByWithAggregationInput | VehicleInfoOrderByWithAggregationInput[]
    by: VehicleInfoScalarFieldEnum[] | VehicleInfoScalarFieldEnum
    having?: VehicleInfoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VehicleInfoCountAggregateInputType | true
    _min?: VehicleInfoMinAggregateInputType
    _max?: VehicleInfoMaxAggregateInputType
  }

  export type VehicleInfoGroupByOutputType = {
    id: string
    imei: string
    vechicleNumb: string
    customerId: string
    createdAt: Date
    updatedAt: Date
    _count: VehicleInfoCountAggregateOutputType | null
    _min: VehicleInfoMinAggregateOutputType | null
    _max: VehicleInfoMaxAggregateOutputType | null
  }

  type GetVehicleInfoGroupByPayload<T extends VehicleInfoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VehicleInfoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VehicleInfoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VehicleInfoGroupByOutputType[P]>
            : GetScalarType<T[P], VehicleInfoGroupByOutputType[P]>
        }
      >
    >


  export type VehicleInfoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    imei?: boolean
    vechicleNumb?: boolean
    customerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customer?: boolean | UserDefaultArgs<ExtArgs>
    locations?: boolean | VehicleInfo$locationsArgs<ExtArgs>
    compliances?: boolean | VehicleInfo$compliancesArgs<ExtArgs>
    geofences?: boolean | VehicleInfo$geofencesArgs<ExtArgs>
    _count?: boolean | VehicleInfoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vehicleInfo"]>

  export type VehicleInfoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    imei?: boolean
    vechicleNumb?: boolean
    customerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customer?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vehicleInfo"]>

  export type VehicleInfoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    imei?: boolean
    vechicleNumb?: boolean
    customerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customer?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vehicleInfo"]>

  export type VehicleInfoSelectScalar = {
    id?: boolean
    imei?: boolean
    vechicleNumb?: boolean
    customerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VehicleInfoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "imei" | "vechicleNumb" | "customerId" | "createdAt" | "updatedAt", ExtArgs["result"]["vehicleInfo"]>
  export type VehicleInfoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | UserDefaultArgs<ExtArgs>
    locations?: boolean | VehicleInfo$locationsArgs<ExtArgs>
    compliances?: boolean | VehicleInfo$compliancesArgs<ExtArgs>
    geofences?: boolean | VehicleInfo$geofencesArgs<ExtArgs>
    _count?: boolean | VehicleInfoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type VehicleInfoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type VehicleInfoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $VehicleInfoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VehicleInfo"
    objects: {
      customer: Prisma.$UserPayload<ExtArgs>
      locations: Prisma.$LocationLogPayload<ExtArgs>[]
      compliances: Prisma.$VehicleCompliancePayload<ExtArgs>[]
      geofences: Prisma.$VehiclesOnGeofencesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      imei: string
      vechicleNumb: string
      customerId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["vehicleInfo"]>
    composites: {}
  }

  type VehicleInfoGetPayload<S extends boolean | null | undefined | VehicleInfoDefaultArgs> = $Result.GetResult<Prisma.$VehicleInfoPayload, S>

  type VehicleInfoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VehicleInfoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VehicleInfoCountAggregateInputType | true
    }

  export interface VehicleInfoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VehicleInfo'], meta: { name: 'VehicleInfo' } }
    /**
     * Find zero or one VehicleInfo that matches the filter.
     * @param {VehicleInfoFindUniqueArgs} args - Arguments to find a VehicleInfo
     * @example
     * // Get one VehicleInfo
     * const vehicleInfo = await prisma.vehicleInfo.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VehicleInfoFindUniqueArgs>(args: SelectSubset<T, VehicleInfoFindUniqueArgs<ExtArgs>>): Prisma__VehicleInfoClient<$Result.GetResult<Prisma.$VehicleInfoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VehicleInfo that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VehicleInfoFindUniqueOrThrowArgs} args - Arguments to find a VehicleInfo
     * @example
     * // Get one VehicleInfo
     * const vehicleInfo = await prisma.vehicleInfo.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VehicleInfoFindUniqueOrThrowArgs>(args: SelectSubset<T, VehicleInfoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VehicleInfoClient<$Result.GetResult<Prisma.$VehicleInfoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VehicleInfo that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleInfoFindFirstArgs} args - Arguments to find a VehicleInfo
     * @example
     * // Get one VehicleInfo
     * const vehicleInfo = await prisma.vehicleInfo.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VehicleInfoFindFirstArgs>(args?: SelectSubset<T, VehicleInfoFindFirstArgs<ExtArgs>>): Prisma__VehicleInfoClient<$Result.GetResult<Prisma.$VehicleInfoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VehicleInfo that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleInfoFindFirstOrThrowArgs} args - Arguments to find a VehicleInfo
     * @example
     * // Get one VehicleInfo
     * const vehicleInfo = await prisma.vehicleInfo.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VehicleInfoFindFirstOrThrowArgs>(args?: SelectSubset<T, VehicleInfoFindFirstOrThrowArgs<ExtArgs>>): Prisma__VehicleInfoClient<$Result.GetResult<Prisma.$VehicleInfoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VehicleInfos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleInfoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VehicleInfos
     * const vehicleInfos = await prisma.vehicleInfo.findMany()
     * 
     * // Get first 10 VehicleInfos
     * const vehicleInfos = await prisma.vehicleInfo.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vehicleInfoWithIdOnly = await prisma.vehicleInfo.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VehicleInfoFindManyArgs>(args?: SelectSubset<T, VehicleInfoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehicleInfoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VehicleInfo.
     * @param {VehicleInfoCreateArgs} args - Arguments to create a VehicleInfo.
     * @example
     * // Create one VehicleInfo
     * const VehicleInfo = await prisma.vehicleInfo.create({
     *   data: {
     *     // ... data to create a VehicleInfo
     *   }
     * })
     * 
     */
    create<T extends VehicleInfoCreateArgs>(args: SelectSubset<T, VehicleInfoCreateArgs<ExtArgs>>): Prisma__VehicleInfoClient<$Result.GetResult<Prisma.$VehicleInfoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VehicleInfos.
     * @param {VehicleInfoCreateManyArgs} args - Arguments to create many VehicleInfos.
     * @example
     * // Create many VehicleInfos
     * const vehicleInfo = await prisma.vehicleInfo.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VehicleInfoCreateManyArgs>(args?: SelectSubset<T, VehicleInfoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VehicleInfos and returns the data saved in the database.
     * @param {VehicleInfoCreateManyAndReturnArgs} args - Arguments to create many VehicleInfos.
     * @example
     * // Create many VehicleInfos
     * const vehicleInfo = await prisma.vehicleInfo.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VehicleInfos and only return the `id`
     * const vehicleInfoWithIdOnly = await prisma.vehicleInfo.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VehicleInfoCreateManyAndReturnArgs>(args?: SelectSubset<T, VehicleInfoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehicleInfoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VehicleInfo.
     * @param {VehicleInfoDeleteArgs} args - Arguments to delete one VehicleInfo.
     * @example
     * // Delete one VehicleInfo
     * const VehicleInfo = await prisma.vehicleInfo.delete({
     *   where: {
     *     // ... filter to delete one VehicleInfo
     *   }
     * })
     * 
     */
    delete<T extends VehicleInfoDeleteArgs>(args: SelectSubset<T, VehicleInfoDeleteArgs<ExtArgs>>): Prisma__VehicleInfoClient<$Result.GetResult<Prisma.$VehicleInfoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VehicleInfo.
     * @param {VehicleInfoUpdateArgs} args - Arguments to update one VehicleInfo.
     * @example
     * // Update one VehicleInfo
     * const vehicleInfo = await prisma.vehicleInfo.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VehicleInfoUpdateArgs>(args: SelectSubset<T, VehicleInfoUpdateArgs<ExtArgs>>): Prisma__VehicleInfoClient<$Result.GetResult<Prisma.$VehicleInfoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VehicleInfos.
     * @param {VehicleInfoDeleteManyArgs} args - Arguments to filter VehicleInfos to delete.
     * @example
     * // Delete a few VehicleInfos
     * const { count } = await prisma.vehicleInfo.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VehicleInfoDeleteManyArgs>(args?: SelectSubset<T, VehicleInfoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VehicleInfos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleInfoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VehicleInfos
     * const vehicleInfo = await prisma.vehicleInfo.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VehicleInfoUpdateManyArgs>(args: SelectSubset<T, VehicleInfoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VehicleInfos and returns the data updated in the database.
     * @param {VehicleInfoUpdateManyAndReturnArgs} args - Arguments to update many VehicleInfos.
     * @example
     * // Update many VehicleInfos
     * const vehicleInfo = await prisma.vehicleInfo.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VehicleInfos and only return the `id`
     * const vehicleInfoWithIdOnly = await prisma.vehicleInfo.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VehicleInfoUpdateManyAndReturnArgs>(args: SelectSubset<T, VehicleInfoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehicleInfoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VehicleInfo.
     * @param {VehicleInfoUpsertArgs} args - Arguments to update or create a VehicleInfo.
     * @example
     * // Update or create a VehicleInfo
     * const vehicleInfo = await prisma.vehicleInfo.upsert({
     *   create: {
     *     // ... data to create a VehicleInfo
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VehicleInfo we want to update
     *   }
     * })
     */
    upsert<T extends VehicleInfoUpsertArgs>(args: SelectSubset<T, VehicleInfoUpsertArgs<ExtArgs>>): Prisma__VehicleInfoClient<$Result.GetResult<Prisma.$VehicleInfoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VehicleInfos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleInfoCountArgs} args - Arguments to filter VehicleInfos to count.
     * @example
     * // Count the number of VehicleInfos
     * const count = await prisma.vehicleInfo.count({
     *   where: {
     *     // ... the filter for the VehicleInfos we want to count
     *   }
     * })
    **/
    count<T extends VehicleInfoCountArgs>(
      args?: Subset<T, VehicleInfoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VehicleInfoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VehicleInfo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleInfoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VehicleInfoAggregateArgs>(args: Subset<T, VehicleInfoAggregateArgs>): Prisma.PrismaPromise<GetVehicleInfoAggregateType<T>>

    /**
     * Group by VehicleInfo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleInfoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VehicleInfoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VehicleInfoGroupByArgs['orderBy'] }
        : { orderBy?: VehicleInfoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VehicleInfoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVehicleInfoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VehicleInfo model
   */
  readonly fields: VehicleInfoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VehicleInfo.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VehicleInfoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    customer<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    locations<T extends VehicleInfo$locationsArgs<ExtArgs> = {}>(args?: Subset<T, VehicleInfo$locationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    compliances<T extends VehicleInfo$compliancesArgs<ExtArgs> = {}>(args?: Subset<T, VehicleInfo$compliancesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehicleCompliancePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    geofences<T extends VehicleInfo$geofencesArgs<ExtArgs> = {}>(args?: Subset<T, VehicleInfo$geofencesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehiclesOnGeofencesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VehicleInfo model
   */
  interface VehicleInfoFieldRefs {
    readonly id: FieldRef<"VehicleInfo", 'String'>
    readonly imei: FieldRef<"VehicleInfo", 'String'>
    readonly vechicleNumb: FieldRef<"VehicleInfo", 'String'>
    readonly customerId: FieldRef<"VehicleInfo", 'String'>
    readonly createdAt: FieldRef<"VehicleInfo", 'DateTime'>
    readonly updatedAt: FieldRef<"VehicleInfo", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VehicleInfo findUnique
   */
  export type VehicleInfoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleInfo
     */
    select?: VehicleInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleInfo
     */
    omit?: VehicleInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInfoInclude<ExtArgs> | null
    /**
     * Filter, which VehicleInfo to fetch.
     */
    where: VehicleInfoWhereUniqueInput
  }

  /**
   * VehicleInfo findUniqueOrThrow
   */
  export type VehicleInfoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleInfo
     */
    select?: VehicleInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleInfo
     */
    omit?: VehicleInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInfoInclude<ExtArgs> | null
    /**
     * Filter, which VehicleInfo to fetch.
     */
    where: VehicleInfoWhereUniqueInput
  }

  /**
   * VehicleInfo findFirst
   */
  export type VehicleInfoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleInfo
     */
    select?: VehicleInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleInfo
     */
    omit?: VehicleInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInfoInclude<ExtArgs> | null
    /**
     * Filter, which VehicleInfo to fetch.
     */
    where?: VehicleInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VehicleInfos to fetch.
     */
    orderBy?: VehicleInfoOrderByWithRelationInput | VehicleInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VehicleInfos.
     */
    cursor?: VehicleInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VehicleInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VehicleInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VehicleInfos.
     */
    distinct?: VehicleInfoScalarFieldEnum | VehicleInfoScalarFieldEnum[]
  }

  /**
   * VehicleInfo findFirstOrThrow
   */
  export type VehicleInfoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleInfo
     */
    select?: VehicleInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleInfo
     */
    omit?: VehicleInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInfoInclude<ExtArgs> | null
    /**
     * Filter, which VehicleInfo to fetch.
     */
    where?: VehicleInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VehicleInfos to fetch.
     */
    orderBy?: VehicleInfoOrderByWithRelationInput | VehicleInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VehicleInfos.
     */
    cursor?: VehicleInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VehicleInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VehicleInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VehicleInfos.
     */
    distinct?: VehicleInfoScalarFieldEnum | VehicleInfoScalarFieldEnum[]
  }

  /**
   * VehicleInfo findMany
   */
  export type VehicleInfoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleInfo
     */
    select?: VehicleInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleInfo
     */
    omit?: VehicleInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInfoInclude<ExtArgs> | null
    /**
     * Filter, which VehicleInfos to fetch.
     */
    where?: VehicleInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VehicleInfos to fetch.
     */
    orderBy?: VehicleInfoOrderByWithRelationInput | VehicleInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VehicleInfos.
     */
    cursor?: VehicleInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VehicleInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VehicleInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VehicleInfos.
     */
    distinct?: VehicleInfoScalarFieldEnum | VehicleInfoScalarFieldEnum[]
  }

  /**
   * VehicleInfo create
   */
  export type VehicleInfoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleInfo
     */
    select?: VehicleInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleInfo
     */
    omit?: VehicleInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInfoInclude<ExtArgs> | null
    /**
     * The data needed to create a VehicleInfo.
     */
    data: XOR<VehicleInfoCreateInput, VehicleInfoUncheckedCreateInput>
  }

  /**
   * VehicleInfo createMany
   */
  export type VehicleInfoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VehicleInfos.
     */
    data: VehicleInfoCreateManyInput | VehicleInfoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VehicleInfo createManyAndReturn
   */
  export type VehicleInfoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleInfo
     */
    select?: VehicleInfoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleInfo
     */
    omit?: VehicleInfoOmit<ExtArgs> | null
    /**
     * The data used to create many VehicleInfos.
     */
    data: VehicleInfoCreateManyInput | VehicleInfoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInfoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * VehicleInfo update
   */
  export type VehicleInfoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleInfo
     */
    select?: VehicleInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleInfo
     */
    omit?: VehicleInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInfoInclude<ExtArgs> | null
    /**
     * The data needed to update a VehicleInfo.
     */
    data: XOR<VehicleInfoUpdateInput, VehicleInfoUncheckedUpdateInput>
    /**
     * Choose, which VehicleInfo to update.
     */
    where: VehicleInfoWhereUniqueInput
  }

  /**
   * VehicleInfo updateMany
   */
  export type VehicleInfoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VehicleInfos.
     */
    data: XOR<VehicleInfoUpdateManyMutationInput, VehicleInfoUncheckedUpdateManyInput>
    /**
     * Filter which VehicleInfos to update
     */
    where?: VehicleInfoWhereInput
    /**
     * Limit how many VehicleInfos to update.
     */
    limit?: number
  }

  /**
   * VehicleInfo updateManyAndReturn
   */
  export type VehicleInfoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleInfo
     */
    select?: VehicleInfoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleInfo
     */
    omit?: VehicleInfoOmit<ExtArgs> | null
    /**
     * The data used to update VehicleInfos.
     */
    data: XOR<VehicleInfoUpdateManyMutationInput, VehicleInfoUncheckedUpdateManyInput>
    /**
     * Filter which VehicleInfos to update
     */
    where?: VehicleInfoWhereInput
    /**
     * Limit how many VehicleInfos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInfoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * VehicleInfo upsert
   */
  export type VehicleInfoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleInfo
     */
    select?: VehicleInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleInfo
     */
    omit?: VehicleInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInfoInclude<ExtArgs> | null
    /**
     * The filter to search for the VehicleInfo to update in case it exists.
     */
    where: VehicleInfoWhereUniqueInput
    /**
     * In case the VehicleInfo found by the `where` argument doesn't exist, create a new VehicleInfo with this data.
     */
    create: XOR<VehicleInfoCreateInput, VehicleInfoUncheckedCreateInput>
    /**
     * In case the VehicleInfo was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VehicleInfoUpdateInput, VehicleInfoUncheckedUpdateInput>
  }

  /**
   * VehicleInfo delete
   */
  export type VehicleInfoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleInfo
     */
    select?: VehicleInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleInfo
     */
    omit?: VehicleInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInfoInclude<ExtArgs> | null
    /**
     * Filter which VehicleInfo to delete.
     */
    where: VehicleInfoWhereUniqueInput
  }

  /**
   * VehicleInfo deleteMany
   */
  export type VehicleInfoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VehicleInfos to delete
     */
    where?: VehicleInfoWhereInput
    /**
     * Limit how many VehicleInfos to delete.
     */
    limit?: number
  }

  /**
   * VehicleInfo.locations
   */
  export type VehicleInfo$locationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationLog
     */
    select?: LocationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationLog
     */
    omit?: LocationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationLogInclude<ExtArgs> | null
    where?: LocationLogWhereInput
    orderBy?: LocationLogOrderByWithRelationInput | LocationLogOrderByWithRelationInput[]
    cursor?: LocationLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LocationLogScalarFieldEnum | LocationLogScalarFieldEnum[]
  }

  /**
   * VehicleInfo.compliances
   */
  export type VehicleInfo$compliancesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleCompliance
     */
    select?: VehicleComplianceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleCompliance
     */
    omit?: VehicleComplianceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleComplianceInclude<ExtArgs> | null
    where?: VehicleComplianceWhereInput
    orderBy?: VehicleComplianceOrderByWithRelationInput | VehicleComplianceOrderByWithRelationInput[]
    cursor?: VehicleComplianceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VehicleComplianceScalarFieldEnum | VehicleComplianceScalarFieldEnum[]
  }

  /**
   * VehicleInfo.geofences
   */
  export type VehicleInfo$geofencesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehiclesOnGeofences
     */
    select?: VehiclesOnGeofencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehiclesOnGeofences
     */
    omit?: VehiclesOnGeofencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehiclesOnGeofencesInclude<ExtArgs> | null
    where?: VehiclesOnGeofencesWhereInput
    orderBy?: VehiclesOnGeofencesOrderByWithRelationInput | VehiclesOnGeofencesOrderByWithRelationInput[]
    cursor?: VehiclesOnGeofencesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VehiclesOnGeofencesScalarFieldEnum | VehiclesOnGeofencesScalarFieldEnum[]
  }

  /**
   * VehicleInfo without action
   */
  export type VehicleInfoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleInfo
     */
    select?: VehicleInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleInfo
     */
    omit?: VehicleInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInfoInclude<ExtArgs> | null
  }


  /**
   * Model LocationLog
   */

  export type AggregateLocationLog = {
    _count: LocationLogCountAggregateOutputType | null
    _avg: LocationLogAvgAggregateOutputType | null
    _sum: LocationLogSumAggregateOutputType | null
    _min: LocationLogMinAggregateOutputType | null
    _max: LocationLogMaxAggregateOutputType | null
  }

  export type LocationLogAvgAggregateOutputType = {
    lat: Decimal | null
    lng: Decimal | null
    altitude: Decimal | null
    speed: Decimal | null
    heading: Decimal | null
    batteryVoltage: number | null
  }

  export type LocationLogSumAggregateOutputType = {
    lat: Decimal | null
    lng: Decimal | null
    altitude: Decimal | null
    speed: Decimal | null
    heading: Decimal | null
    batteryVoltage: number | null
  }

  export type LocationLogMinAggregateOutputType = {
    id: string | null
    imei: string | null
    lat: Decimal | null
    lng: Decimal | null
    altitude: Decimal | null
    speed: Decimal | null
    heading: Decimal | null
    batteryVoltage: number | null
    ignition: boolean | null
    timestamp: Date | null
    createdAt: Date | null
  }

  export type LocationLogMaxAggregateOutputType = {
    id: string | null
    imei: string | null
    lat: Decimal | null
    lng: Decimal | null
    altitude: Decimal | null
    speed: Decimal | null
    heading: Decimal | null
    batteryVoltage: number | null
    ignition: boolean | null
    timestamp: Date | null
    createdAt: Date | null
  }

  export type LocationLogCountAggregateOutputType = {
    id: number
    imei: number
    lat: number
    lng: number
    altitude: number
    speed: number
    heading: number
    batteryVoltage: number
    ignition: number
    timestamp: number
    createdAt: number
    _all: number
  }


  export type LocationLogAvgAggregateInputType = {
    lat?: true
    lng?: true
    altitude?: true
    speed?: true
    heading?: true
    batteryVoltage?: true
  }

  export type LocationLogSumAggregateInputType = {
    lat?: true
    lng?: true
    altitude?: true
    speed?: true
    heading?: true
    batteryVoltage?: true
  }

  export type LocationLogMinAggregateInputType = {
    id?: true
    imei?: true
    lat?: true
    lng?: true
    altitude?: true
    speed?: true
    heading?: true
    batteryVoltage?: true
    ignition?: true
    timestamp?: true
    createdAt?: true
  }

  export type LocationLogMaxAggregateInputType = {
    id?: true
    imei?: true
    lat?: true
    lng?: true
    altitude?: true
    speed?: true
    heading?: true
    batteryVoltage?: true
    ignition?: true
    timestamp?: true
    createdAt?: true
  }

  export type LocationLogCountAggregateInputType = {
    id?: true
    imei?: true
    lat?: true
    lng?: true
    altitude?: true
    speed?: true
    heading?: true
    batteryVoltage?: true
    ignition?: true
    timestamp?: true
    createdAt?: true
    _all?: true
  }

  export type LocationLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocationLog to aggregate.
     */
    where?: LocationLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocationLogs to fetch.
     */
    orderBy?: LocationLogOrderByWithRelationInput | LocationLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LocationLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocationLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocationLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LocationLogs
    **/
    _count?: true | LocationLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LocationLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LocationLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocationLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocationLogMaxAggregateInputType
  }

  export type GetLocationLogAggregateType<T extends LocationLogAggregateArgs> = {
        [P in keyof T & keyof AggregateLocationLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocationLog[P]>
      : GetScalarType<T[P], AggregateLocationLog[P]>
  }




  export type LocationLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocationLogWhereInput
    orderBy?: LocationLogOrderByWithAggregationInput | LocationLogOrderByWithAggregationInput[]
    by: LocationLogScalarFieldEnum[] | LocationLogScalarFieldEnum
    having?: LocationLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocationLogCountAggregateInputType | true
    _avg?: LocationLogAvgAggregateInputType
    _sum?: LocationLogSumAggregateInputType
    _min?: LocationLogMinAggregateInputType
    _max?: LocationLogMaxAggregateInputType
  }

  export type LocationLogGroupByOutputType = {
    id: string
    imei: string
    lat: Decimal
    lng: Decimal
    altitude: Decimal | null
    speed: Decimal | null
    heading: Decimal | null
    batteryVoltage: number | null
    ignition: boolean
    timestamp: Date
    createdAt: Date
    _count: LocationLogCountAggregateOutputType | null
    _avg: LocationLogAvgAggregateOutputType | null
    _sum: LocationLogSumAggregateOutputType | null
    _min: LocationLogMinAggregateOutputType | null
    _max: LocationLogMaxAggregateOutputType | null
  }

  type GetLocationLogGroupByPayload<T extends LocationLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocationLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocationLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocationLogGroupByOutputType[P]>
            : GetScalarType<T[P], LocationLogGroupByOutputType[P]>
        }
      >
    >


  export type LocationLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    imei?: boolean
    lat?: boolean
    lng?: boolean
    altitude?: boolean
    speed?: boolean
    heading?: boolean
    batteryVoltage?: boolean
    ignition?: boolean
    timestamp?: boolean
    createdAt?: boolean
    vehicle?: boolean | VehicleInfoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["locationLog"]>

  export type LocationLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    imei?: boolean
    lat?: boolean
    lng?: boolean
    altitude?: boolean
    speed?: boolean
    heading?: boolean
    batteryVoltage?: boolean
    ignition?: boolean
    timestamp?: boolean
    createdAt?: boolean
    vehicle?: boolean | VehicleInfoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["locationLog"]>

  export type LocationLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    imei?: boolean
    lat?: boolean
    lng?: boolean
    altitude?: boolean
    speed?: boolean
    heading?: boolean
    batteryVoltage?: boolean
    ignition?: boolean
    timestamp?: boolean
    createdAt?: boolean
    vehicle?: boolean | VehicleInfoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["locationLog"]>

  export type LocationLogSelectScalar = {
    id?: boolean
    imei?: boolean
    lat?: boolean
    lng?: boolean
    altitude?: boolean
    speed?: boolean
    heading?: boolean
    batteryVoltage?: boolean
    ignition?: boolean
    timestamp?: boolean
    createdAt?: boolean
  }

  export type LocationLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "imei" | "lat" | "lng" | "altitude" | "speed" | "heading" | "batteryVoltage" | "ignition" | "timestamp" | "createdAt", ExtArgs["result"]["locationLog"]>
  export type LocationLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle?: boolean | VehicleInfoDefaultArgs<ExtArgs>
  }
  export type LocationLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle?: boolean | VehicleInfoDefaultArgs<ExtArgs>
  }
  export type LocationLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle?: boolean | VehicleInfoDefaultArgs<ExtArgs>
  }

  export type $LocationLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LocationLog"
    objects: {
      vehicle: Prisma.$VehicleInfoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      imei: string
      lat: Prisma.Decimal
      lng: Prisma.Decimal
      altitude: Prisma.Decimal | null
      speed: Prisma.Decimal | null
      heading: Prisma.Decimal | null
      batteryVoltage: number | null
      ignition: boolean
      timestamp: Date
      createdAt: Date
    }, ExtArgs["result"]["locationLog"]>
    composites: {}
  }

  type LocationLogGetPayload<S extends boolean | null | undefined | LocationLogDefaultArgs> = $Result.GetResult<Prisma.$LocationLogPayload, S>

  type LocationLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LocationLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LocationLogCountAggregateInputType | true
    }

  export interface LocationLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LocationLog'], meta: { name: 'LocationLog' } }
    /**
     * Find zero or one LocationLog that matches the filter.
     * @param {LocationLogFindUniqueArgs} args - Arguments to find a LocationLog
     * @example
     * // Get one LocationLog
     * const locationLog = await prisma.locationLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LocationLogFindUniqueArgs>(args: SelectSubset<T, LocationLogFindUniqueArgs<ExtArgs>>): Prisma__LocationLogClient<$Result.GetResult<Prisma.$LocationLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LocationLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LocationLogFindUniqueOrThrowArgs} args - Arguments to find a LocationLog
     * @example
     * // Get one LocationLog
     * const locationLog = await prisma.locationLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LocationLogFindUniqueOrThrowArgs>(args: SelectSubset<T, LocationLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LocationLogClient<$Result.GetResult<Prisma.$LocationLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocationLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationLogFindFirstArgs} args - Arguments to find a LocationLog
     * @example
     * // Get one LocationLog
     * const locationLog = await prisma.locationLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LocationLogFindFirstArgs>(args?: SelectSubset<T, LocationLogFindFirstArgs<ExtArgs>>): Prisma__LocationLogClient<$Result.GetResult<Prisma.$LocationLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocationLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationLogFindFirstOrThrowArgs} args - Arguments to find a LocationLog
     * @example
     * // Get one LocationLog
     * const locationLog = await prisma.locationLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LocationLogFindFirstOrThrowArgs>(args?: SelectSubset<T, LocationLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__LocationLogClient<$Result.GetResult<Prisma.$LocationLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LocationLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LocationLogs
     * const locationLogs = await prisma.locationLog.findMany()
     * 
     * // Get first 10 LocationLogs
     * const locationLogs = await prisma.locationLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const locationLogWithIdOnly = await prisma.locationLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LocationLogFindManyArgs>(args?: SelectSubset<T, LocationLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LocationLog.
     * @param {LocationLogCreateArgs} args - Arguments to create a LocationLog.
     * @example
     * // Create one LocationLog
     * const LocationLog = await prisma.locationLog.create({
     *   data: {
     *     // ... data to create a LocationLog
     *   }
     * })
     * 
     */
    create<T extends LocationLogCreateArgs>(args: SelectSubset<T, LocationLogCreateArgs<ExtArgs>>): Prisma__LocationLogClient<$Result.GetResult<Prisma.$LocationLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LocationLogs.
     * @param {LocationLogCreateManyArgs} args - Arguments to create many LocationLogs.
     * @example
     * // Create many LocationLogs
     * const locationLog = await prisma.locationLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LocationLogCreateManyArgs>(args?: SelectSubset<T, LocationLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LocationLogs and returns the data saved in the database.
     * @param {LocationLogCreateManyAndReturnArgs} args - Arguments to create many LocationLogs.
     * @example
     * // Create many LocationLogs
     * const locationLog = await prisma.locationLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LocationLogs and only return the `id`
     * const locationLogWithIdOnly = await prisma.locationLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LocationLogCreateManyAndReturnArgs>(args?: SelectSubset<T, LocationLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LocationLog.
     * @param {LocationLogDeleteArgs} args - Arguments to delete one LocationLog.
     * @example
     * // Delete one LocationLog
     * const LocationLog = await prisma.locationLog.delete({
     *   where: {
     *     // ... filter to delete one LocationLog
     *   }
     * })
     * 
     */
    delete<T extends LocationLogDeleteArgs>(args: SelectSubset<T, LocationLogDeleteArgs<ExtArgs>>): Prisma__LocationLogClient<$Result.GetResult<Prisma.$LocationLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LocationLog.
     * @param {LocationLogUpdateArgs} args - Arguments to update one LocationLog.
     * @example
     * // Update one LocationLog
     * const locationLog = await prisma.locationLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LocationLogUpdateArgs>(args: SelectSubset<T, LocationLogUpdateArgs<ExtArgs>>): Prisma__LocationLogClient<$Result.GetResult<Prisma.$LocationLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LocationLogs.
     * @param {LocationLogDeleteManyArgs} args - Arguments to filter LocationLogs to delete.
     * @example
     * // Delete a few LocationLogs
     * const { count } = await prisma.locationLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LocationLogDeleteManyArgs>(args?: SelectSubset<T, LocationLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocationLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LocationLogs
     * const locationLog = await prisma.locationLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LocationLogUpdateManyArgs>(args: SelectSubset<T, LocationLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocationLogs and returns the data updated in the database.
     * @param {LocationLogUpdateManyAndReturnArgs} args - Arguments to update many LocationLogs.
     * @example
     * // Update many LocationLogs
     * const locationLog = await prisma.locationLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LocationLogs and only return the `id`
     * const locationLogWithIdOnly = await prisma.locationLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LocationLogUpdateManyAndReturnArgs>(args: SelectSubset<T, LocationLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LocationLog.
     * @param {LocationLogUpsertArgs} args - Arguments to update or create a LocationLog.
     * @example
     * // Update or create a LocationLog
     * const locationLog = await prisma.locationLog.upsert({
     *   create: {
     *     // ... data to create a LocationLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LocationLog we want to update
     *   }
     * })
     */
    upsert<T extends LocationLogUpsertArgs>(args: SelectSubset<T, LocationLogUpsertArgs<ExtArgs>>): Prisma__LocationLogClient<$Result.GetResult<Prisma.$LocationLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LocationLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationLogCountArgs} args - Arguments to filter LocationLogs to count.
     * @example
     * // Count the number of LocationLogs
     * const count = await prisma.locationLog.count({
     *   where: {
     *     // ... the filter for the LocationLogs we want to count
     *   }
     * })
    **/
    count<T extends LocationLogCountArgs>(
      args?: Subset<T, LocationLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocationLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LocationLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LocationLogAggregateArgs>(args: Subset<T, LocationLogAggregateArgs>): Prisma.PrismaPromise<GetLocationLogAggregateType<T>>

    /**
     * Group by LocationLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LocationLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LocationLogGroupByArgs['orderBy'] }
        : { orderBy?: LocationLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LocationLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocationLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LocationLog model
   */
  readonly fields: LocationLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LocationLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LocationLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    vehicle<T extends VehicleInfoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VehicleInfoDefaultArgs<ExtArgs>>): Prisma__VehicleInfoClient<$Result.GetResult<Prisma.$VehicleInfoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LocationLog model
   */
  interface LocationLogFieldRefs {
    readonly id: FieldRef<"LocationLog", 'String'>
    readonly imei: FieldRef<"LocationLog", 'String'>
    readonly lat: FieldRef<"LocationLog", 'Decimal'>
    readonly lng: FieldRef<"LocationLog", 'Decimal'>
    readonly altitude: FieldRef<"LocationLog", 'Decimal'>
    readonly speed: FieldRef<"LocationLog", 'Decimal'>
    readonly heading: FieldRef<"LocationLog", 'Decimal'>
    readonly batteryVoltage: FieldRef<"LocationLog", 'Float'>
    readonly ignition: FieldRef<"LocationLog", 'Boolean'>
    readonly timestamp: FieldRef<"LocationLog", 'DateTime'>
    readonly createdAt: FieldRef<"LocationLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LocationLog findUnique
   */
  export type LocationLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationLog
     */
    select?: LocationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationLog
     */
    omit?: LocationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationLogInclude<ExtArgs> | null
    /**
     * Filter, which LocationLog to fetch.
     */
    where: LocationLogWhereUniqueInput
  }

  /**
   * LocationLog findUniqueOrThrow
   */
  export type LocationLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationLog
     */
    select?: LocationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationLog
     */
    omit?: LocationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationLogInclude<ExtArgs> | null
    /**
     * Filter, which LocationLog to fetch.
     */
    where: LocationLogWhereUniqueInput
  }

  /**
   * LocationLog findFirst
   */
  export type LocationLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationLog
     */
    select?: LocationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationLog
     */
    omit?: LocationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationLogInclude<ExtArgs> | null
    /**
     * Filter, which LocationLog to fetch.
     */
    where?: LocationLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocationLogs to fetch.
     */
    orderBy?: LocationLogOrderByWithRelationInput | LocationLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocationLogs.
     */
    cursor?: LocationLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocationLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocationLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocationLogs.
     */
    distinct?: LocationLogScalarFieldEnum | LocationLogScalarFieldEnum[]
  }

  /**
   * LocationLog findFirstOrThrow
   */
  export type LocationLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationLog
     */
    select?: LocationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationLog
     */
    omit?: LocationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationLogInclude<ExtArgs> | null
    /**
     * Filter, which LocationLog to fetch.
     */
    where?: LocationLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocationLogs to fetch.
     */
    orderBy?: LocationLogOrderByWithRelationInput | LocationLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocationLogs.
     */
    cursor?: LocationLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocationLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocationLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocationLogs.
     */
    distinct?: LocationLogScalarFieldEnum | LocationLogScalarFieldEnum[]
  }

  /**
   * LocationLog findMany
   */
  export type LocationLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationLog
     */
    select?: LocationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationLog
     */
    omit?: LocationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationLogInclude<ExtArgs> | null
    /**
     * Filter, which LocationLogs to fetch.
     */
    where?: LocationLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocationLogs to fetch.
     */
    orderBy?: LocationLogOrderByWithRelationInput | LocationLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LocationLogs.
     */
    cursor?: LocationLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocationLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocationLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocationLogs.
     */
    distinct?: LocationLogScalarFieldEnum | LocationLogScalarFieldEnum[]
  }

  /**
   * LocationLog create
   */
  export type LocationLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationLog
     */
    select?: LocationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationLog
     */
    omit?: LocationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationLogInclude<ExtArgs> | null
    /**
     * The data needed to create a LocationLog.
     */
    data: XOR<LocationLogCreateInput, LocationLogUncheckedCreateInput>
  }

  /**
   * LocationLog createMany
   */
  export type LocationLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LocationLogs.
     */
    data: LocationLogCreateManyInput | LocationLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LocationLog createManyAndReturn
   */
  export type LocationLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationLog
     */
    select?: LocationLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocationLog
     */
    omit?: LocationLogOmit<ExtArgs> | null
    /**
     * The data used to create many LocationLogs.
     */
    data: LocationLogCreateManyInput | LocationLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LocationLog update
   */
  export type LocationLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationLog
     */
    select?: LocationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationLog
     */
    omit?: LocationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationLogInclude<ExtArgs> | null
    /**
     * The data needed to update a LocationLog.
     */
    data: XOR<LocationLogUpdateInput, LocationLogUncheckedUpdateInput>
    /**
     * Choose, which LocationLog to update.
     */
    where: LocationLogWhereUniqueInput
  }

  /**
   * LocationLog updateMany
   */
  export type LocationLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LocationLogs.
     */
    data: XOR<LocationLogUpdateManyMutationInput, LocationLogUncheckedUpdateManyInput>
    /**
     * Filter which LocationLogs to update
     */
    where?: LocationLogWhereInput
    /**
     * Limit how many LocationLogs to update.
     */
    limit?: number
  }

  /**
   * LocationLog updateManyAndReturn
   */
  export type LocationLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationLog
     */
    select?: LocationLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocationLog
     */
    omit?: LocationLogOmit<ExtArgs> | null
    /**
     * The data used to update LocationLogs.
     */
    data: XOR<LocationLogUpdateManyMutationInput, LocationLogUncheckedUpdateManyInput>
    /**
     * Filter which LocationLogs to update
     */
    where?: LocationLogWhereInput
    /**
     * Limit how many LocationLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LocationLog upsert
   */
  export type LocationLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationLog
     */
    select?: LocationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationLog
     */
    omit?: LocationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationLogInclude<ExtArgs> | null
    /**
     * The filter to search for the LocationLog to update in case it exists.
     */
    where: LocationLogWhereUniqueInput
    /**
     * In case the LocationLog found by the `where` argument doesn't exist, create a new LocationLog with this data.
     */
    create: XOR<LocationLogCreateInput, LocationLogUncheckedCreateInput>
    /**
     * In case the LocationLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LocationLogUpdateInput, LocationLogUncheckedUpdateInput>
  }

  /**
   * LocationLog delete
   */
  export type LocationLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationLog
     */
    select?: LocationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationLog
     */
    omit?: LocationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationLogInclude<ExtArgs> | null
    /**
     * Filter which LocationLog to delete.
     */
    where: LocationLogWhereUniqueInput
  }

  /**
   * LocationLog deleteMany
   */
  export type LocationLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocationLogs to delete
     */
    where?: LocationLogWhereInput
    /**
     * Limit how many LocationLogs to delete.
     */
    limit?: number
  }

  /**
   * LocationLog without action
   */
  export type LocationLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationLog
     */
    select?: LocationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationLog
     */
    omit?: LocationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationLogInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    role: $Enums.userRole | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    role: $Enums.userRole | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    password: number
    role: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    password: string
    role: $Enums.userRole
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    vehicleInfos?: boolean | User$vehicleInfosArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "password" | "role" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicleInfos?: boolean | User$vehicleInfosArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      vehicleInfos: Prisma.$VehicleInfoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      password: string
      role: $Enums.userRole
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    vehicleInfos<T extends User$vehicleInfosArgs<ExtArgs> = {}>(args?: Subset<T, User$vehicleInfosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehicleInfoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'userRole'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.vehicleInfos
   */
  export type User$vehicleInfosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleInfo
     */
    select?: VehicleInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleInfo
     */
    omit?: VehicleInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInfoInclude<ExtArgs> | null
    where?: VehicleInfoWhereInput
    orderBy?: VehicleInfoOrderByWithRelationInput | VehicleInfoOrderByWithRelationInput[]
    cursor?: VehicleInfoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VehicleInfoScalarFieldEnum | VehicleInfoScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Geofence
   */

  export type AggregateGeofence = {
    _count: GeofenceCountAggregateOutputType | null
    _min: GeofenceMinAggregateOutputType | null
    _max: GeofenceMaxAggregateOutputType | null
  }

  export type GeofenceMinAggregateOutputType = {
    id: string | null
    name: string | null
    zoneHash: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GeofenceMaxAggregateOutputType = {
    id: string | null
    name: string | null
    zoneHash: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GeofenceCountAggregateOutputType = {
    id: number
    name: number
    zoneHash: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type GeofenceMinAggregateInputType = {
    id?: true
    name?: true
    zoneHash?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GeofenceMaxAggregateInputType = {
    id?: true
    name?: true
    zoneHash?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GeofenceCountAggregateInputType = {
    id?: true
    name?: true
    zoneHash?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type GeofenceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Geofence to aggregate.
     */
    where?: GeofenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Geofences to fetch.
     */
    orderBy?: GeofenceOrderByWithRelationInput | GeofenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GeofenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Geofences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Geofences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Geofences
    **/
    _count?: true | GeofenceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GeofenceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GeofenceMaxAggregateInputType
  }

  export type GetGeofenceAggregateType<T extends GeofenceAggregateArgs> = {
        [P in keyof T & keyof AggregateGeofence]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGeofence[P]>
      : GetScalarType<T[P], AggregateGeofence[P]>
  }




  export type GeofenceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GeofenceWhereInput
    orderBy?: GeofenceOrderByWithAggregationInput | GeofenceOrderByWithAggregationInput[]
    by: GeofenceScalarFieldEnum[] | GeofenceScalarFieldEnum
    having?: GeofenceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GeofenceCountAggregateInputType | true
    _min?: GeofenceMinAggregateInputType
    _max?: GeofenceMaxAggregateInputType
  }

  export type GeofenceGroupByOutputType = {
    id: string
    name: string
    zoneHash: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: GeofenceCountAggregateOutputType | null
    _min: GeofenceMinAggregateOutputType | null
    _max: GeofenceMaxAggregateOutputType | null
  }

  type GetGeofenceGroupByPayload<T extends GeofenceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GeofenceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GeofenceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GeofenceGroupByOutputType[P]>
            : GetScalarType<T[P], GeofenceGroupByOutputType[P]>
        }
      >
    >


  export type GeofenceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    zoneHash?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    vehicles?: boolean | Geofence$vehiclesArgs<ExtArgs>
    _count?: boolean | GeofenceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["geofence"]>

  export type GeofenceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    zoneHash?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["geofence"]>

  export type GeofenceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    zoneHash?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["geofence"]>

  export type GeofenceSelectScalar = {
    id?: boolean
    name?: boolean
    zoneHash?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type GeofenceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "zoneHash" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["geofence"]>
  export type GeofenceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicles?: boolean | Geofence$vehiclesArgs<ExtArgs>
    _count?: boolean | GeofenceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type GeofenceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type GeofenceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $GeofencePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Geofence"
    objects: {
      vehicles: Prisma.$VehiclesOnGeofencesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      zoneHash: string | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["geofence"]>
    composites: {}
  }

  type GeofenceGetPayload<S extends boolean | null | undefined | GeofenceDefaultArgs> = $Result.GetResult<Prisma.$GeofencePayload, S>

  type GeofenceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GeofenceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GeofenceCountAggregateInputType | true
    }

  export interface GeofenceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Geofence'], meta: { name: 'Geofence' } }
    /**
     * Find zero or one Geofence that matches the filter.
     * @param {GeofenceFindUniqueArgs} args - Arguments to find a Geofence
     * @example
     * // Get one Geofence
     * const geofence = await prisma.geofence.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GeofenceFindUniqueArgs>(args: SelectSubset<T, GeofenceFindUniqueArgs<ExtArgs>>): Prisma__GeofenceClient<$Result.GetResult<Prisma.$GeofencePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Geofence that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GeofenceFindUniqueOrThrowArgs} args - Arguments to find a Geofence
     * @example
     * // Get one Geofence
     * const geofence = await prisma.geofence.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GeofenceFindUniqueOrThrowArgs>(args: SelectSubset<T, GeofenceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GeofenceClient<$Result.GetResult<Prisma.$GeofencePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Geofence that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeofenceFindFirstArgs} args - Arguments to find a Geofence
     * @example
     * // Get one Geofence
     * const geofence = await prisma.geofence.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GeofenceFindFirstArgs>(args?: SelectSubset<T, GeofenceFindFirstArgs<ExtArgs>>): Prisma__GeofenceClient<$Result.GetResult<Prisma.$GeofencePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Geofence that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeofenceFindFirstOrThrowArgs} args - Arguments to find a Geofence
     * @example
     * // Get one Geofence
     * const geofence = await prisma.geofence.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GeofenceFindFirstOrThrowArgs>(args?: SelectSubset<T, GeofenceFindFirstOrThrowArgs<ExtArgs>>): Prisma__GeofenceClient<$Result.GetResult<Prisma.$GeofencePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Geofences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeofenceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Geofences
     * const geofences = await prisma.geofence.findMany()
     * 
     * // Get first 10 Geofences
     * const geofences = await prisma.geofence.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const geofenceWithIdOnly = await prisma.geofence.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GeofenceFindManyArgs>(args?: SelectSubset<T, GeofenceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GeofencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Geofence.
     * @param {GeofenceCreateArgs} args - Arguments to create a Geofence.
     * @example
     * // Create one Geofence
     * const Geofence = await prisma.geofence.create({
     *   data: {
     *     // ... data to create a Geofence
     *   }
     * })
     * 
     */
    create<T extends GeofenceCreateArgs>(args: SelectSubset<T, GeofenceCreateArgs<ExtArgs>>): Prisma__GeofenceClient<$Result.GetResult<Prisma.$GeofencePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Geofences.
     * @param {GeofenceCreateManyArgs} args - Arguments to create many Geofences.
     * @example
     * // Create many Geofences
     * const geofence = await prisma.geofence.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GeofenceCreateManyArgs>(args?: SelectSubset<T, GeofenceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Geofences and returns the data saved in the database.
     * @param {GeofenceCreateManyAndReturnArgs} args - Arguments to create many Geofences.
     * @example
     * // Create many Geofences
     * const geofence = await prisma.geofence.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Geofences and only return the `id`
     * const geofenceWithIdOnly = await prisma.geofence.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GeofenceCreateManyAndReturnArgs>(args?: SelectSubset<T, GeofenceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GeofencePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Geofence.
     * @param {GeofenceDeleteArgs} args - Arguments to delete one Geofence.
     * @example
     * // Delete one Geofence
     * const Geofence = await prisma.geofence.delete({
     *   where: {
     *     // ... filter to delete one Geofence
     *   }
     * })
     * 
     */
    delete<T extends GeofenceDeleteArgs>(args: SelectSubset<T, GeofenceDeleteArgs<ExtArgs>>): Prisma__GeofenceClient<$Result.GetResult<Prisma.$GeofencePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Geofence.
     * @param {GeofenceUpdateArgs} args - Arguments to update one Geofence.
     * @example
     * // Update one Geofence
     * const geofence = await prisma.geofence.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GeofenceUpdateArgs>(args: SelectSubset<T, GeofenceUpdateArgs<ExtArgs>>): Prisma__GeofenceClient<$Result.GetResult<Prisma.$GeofencePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Geofences.
     * @param {GeofenceDeleteManyArgs} args - Arguments to filter Geofences to delete.
     * @example
     * // Delete a few Geofences
     * const { count } = await prisma.geofence.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GeofenceDeleteManyArgs>(args?: SelectSubset<T, GeofenceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Geofences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeofenceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Geofences
     * const geofence = await prisma.geofence.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GeofenceUpdateManyArgs>(args: SelectSubset<T, GeofenceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Geofences and returns the data updated in the database.
     * @param {GeofenceUpdateManyAndReturnArgs} args - Arguments to update many Geofences.
     * @example
     * // Update many Geofences
     * const geofence = await prisma.geofence.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Geofences and only return the `id`
     * const geofenceWithIdOnly = await prisma.geofence.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GeofenceUpdateManyAndReturnArgs>(args: SelectSubset<T, GeofenceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GeofencePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Geofence.
     * @param {GeofenceUpsertArgs} args - Arguments to update or create a Geofence.
     * @example
     * // Update or create a Geofence
     * const geofence = await prisma.geofence.upsert({
     *   create: {
     *     // ... data to create a Geofence
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Geofence we want to update
     *   }
     * })
     */
    upsert<T extends GeofenceUpsertArgs>(args: SelectSubset<T, GeofenceUpsertArgs<ExtArgs>>): Prisma__GeofenceClient<$Result.GetResult<Prisma.$GeofencePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Geofences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeofenceCountArgs} args - Arguments to filter Geofences to count.
     * @example
     * // Count the number of Geofences
     * const count = await prisma.geofence.count({
     *   where: {
     *     // ... the filter for the Geofences we want to count
     *   }
     * })
    **/
    count<T extends GeofenceCountArgs>(
      args?: Subset<T, GeofenceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GeofenceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Geofence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeofenceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GeofenceAggregateArgs>(args: Subset<T, GeofenceAggregateArgs>): Prisma.PrismaPromise<GetGeofenceAggregateType<T>>

    /**
     * Group by Geofence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeofenceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GeofenceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GeofenceGroupByArgs['orderBy'] }
        : { orderBy?: GeofenceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GeofenceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGeofenceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Geofence model
   */
  readonly fields: GeofenceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Geofence.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GeofenceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    vehicles<T extends Geofence$vehiclesArgs<ExtArgs> = {}>(args?: Subset<T, Geofence$vehiclesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehiclesOnGeofencesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Geofence model
   */
  interface GeofenceFieldRefs {
    readonly id: FieldRef<"Geofence", 'String'>
    readonly name: FieldRef<"Geofence", 'String'>
    readonly zoneHash: FieldRef<"Geofence", 'String'>
    readonly isActive: FieldRef<"Geofence", 'Boolean'>
    readonly createdAt: FieldRef<"Geofence", 'DateTime'>
    readonly updatedAt: FieldRef<"Geofence", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Geofence findUnique
   */
  export type GeofenceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Geofence
     */
    select?: GeofenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Geofence
     */
    omit?: GeofenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeofenceInclude<ExtArgs> | null
    /**
     * Filter, which Geofence to fetch.
     */
    where: GeofenceWhereUniqueInput
  }

  /**
   * Geofence findUniqueOrThrow
   */
  export type GeofenceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Geofence
     */
    select?: GeofenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Geofence
     */
    omit?: GeofenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeofenceInclude<ExtArgs> | null
    /**
     * Filter, which Geofence to fetch.
     */
    where: GeofenceWhereUniqueInput
  }

  /**
   * Geofence findFirst
   */
  export type GeofenceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Geofence
     */
    select?: GeofenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Geofence
     */
    omit?: GeofenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeofenceInclude<ExtArgs> | null
    /**
     * Filter, which Geofence to fetch.
     */
    where?: GeofenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Geofences to fetch.
     */
    orderBy?: GeofenceOrderByWithRelationInput | GeofenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Geofences.
     */
    cursor?: GeofenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Geofences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Geofences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Geofences.
     */
    distinct?: GeofenceScalarFieldEnum | GeofenceScalarFieldEnum[]
  }

  /**
   * Geofence findFirstOrThrow
   */
  export type GeofenceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Geofence
     */
    select?: GeofenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Geofence
     */
    omit?: GeofenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeofenceInclude<ExtArgs> | null
    /**
     * Filter, which Geofence to fetch.
     */
    where?: GeofenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Geofences to fetch.
     */
    orderBy?: GeofenceOrderByWithRelationInput | GeofenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Geofences.
     */
    cursor?: GeofenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Geofences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Geofences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Geofences.
     */
    distinct?: GeofenceScalarFieldEnum | GeofenceScalarFieldEnum[]
  }

  /**
   * Geofence findMany
   */
  export type GeofenceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Geofence
     */
    select?: GeofenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Geofence
     */
    omit?: GeofenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeofenceInclude<ExtArgs> | null
    /**
     * Filter, which Geofences to fetch.
     */
    where?: GeofenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Geofences to fetch.
     */
    orderBy?: GeofenceOrderByWithRelationInput | GeofenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Geofences.
     */
    cursor?: GeofenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Geofences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Geofences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Geofences.
     */
    distinct?: GeofenceScalarFieldEnum | GeofenceScalarFieldEnum[]
  }

  /**
   * Geofence create
   */
  export type GeofenceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Geofence
     */
    select?: GeofenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Geofence
     */
    omit?: GeofenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeofenceInclude<ExtArgs> | null
    /**
     * The data needed to create a Geofence.
     */
    data: XOR<GeofenceCreateInput, GeofenceUncheckedCreateInput>
  }

  /**
   * Geofence createMany
   */
  export type GeofenceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Geofences.
     */
    data: GeofenceCreateManyInput | GeofenceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Geofence createManyAndReturn
   */
  export type GeofenceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Geofence
     */
    select?: GeofenceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Geofence
     */
    omit?: GeofenceOmit<ExtArgs> | null
    /**
     * The data used to create many Geofences.
     */
    data: GeofenceCreateManyInput | GeofenceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Geofence update
   */
  export type GeofenceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Geofence
     */
    select?: GeofenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Geofence
     */
    omit?: GeofenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeofenceInclude<ExtArgs> | null
    /**
     * The data needed to update a Geofence.
     */
    data: XOR<GeofenceUpdateInput, GeofenceUncheckedUpdateInput>
    /**
     * Choose, which Geofence to update.
     */
    where: GeofenceWhereUniqueInput
  }

  /**
   * Geofence updateMany
   */
  export type GeofenceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Geofences.
     */
    data: XOR<GeofenceUpdateManyMutationInput, GeofenceUncheckedUpdateManyInput>
    /**
     * Filter which Geofences to update
     */
    where?: GeofenceWhereInput
    /**
     * Limit how many Geofences to update.
     */
    limit?: number
  }

  /**
   * Geofence updateManyAndReturn
   */
  export type GeofenceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Geofence
     */
    select?: GeofenceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Geofence
     */
    omit?: GeofenceOmit<ExtArgs> | null
    /**
     * The data used to update Geofences.
     */
    data: XOR<GeofenceUpdateManyMutationInput, GeofenceUncheckedUpdateManyInput>
    /**
     * Filter which Geofences to update
     */
    where?: GeofenceWhereInput
    /**
     * Limit how many Geofences to update.
     */
    limit?: number
  }

  /**
   * Geofence upsert
   */
  export type GeofenceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Geofence
     */
    select?: GeofenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Geofence
     */
    omit?: GeofenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeofenceInclude<ExtArgs> | null
    /**
     * The filter to search for the Geofence to update in case it exists.
     */
    where: GeofenceWhereUniqueInput
    /**
     * In case the Geofence found by the `where` argument doesn't exist, create a new Geofence with this data.
     */
    create: XOR<GeofenceCreateInput, GeofenceUncheckedCreateInput>
    /**
     * In case the Geofence was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GeofenceUpdateInput, GeofenceUncheckedUpdateInput>
  }

  /**
   * Geofence delete
   */
  export type GeofenceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Geofence
     */
    select?: GeofenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Geofence
     */
    omit?: GeofenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeofenceInclude<ExtArgs> | null
    /**
     * Filter which Geofence to delete.
     */
    where: GeofenceWhereUniqueInput
  }

  /**
   * Geofence deleteMany
   */
  export type GeofenceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Geofences to delete
     */
    where?: GeofenceWhereInput
    /**
     * Limit how many Geofences to delete.
     */
    limit?: number
  }

  /**
   * Geofence.vehicles
   */
  export type Geofence$vehiclesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehiclesOnGeofences
     */
    select?: VehiclesOnGeofencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehiclesOnGeofences
     */
    omit?: VehiclesOnGeofencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehiclesOnGeofencesInclude<ExtArgs> | null
    where?: VehiclesOnGeofencesWhereInput
    orderBy?: VehiclesOnGeofencesOrderByWithRelationInput | VehiclesOnGeofencesOrderByWithRelationInput[]
    cursor?: VehiclesOnGeofencesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VehiclesOnGeofencesScalarFieldEnum | VehiclesOnGeofencesScalarFieldEnum[]
  }

  /**
   * Geofence without action
   */
  export type GeofenceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Geofence
     */
    select?: GeofenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Geofence
     */
    omit?: GeofenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeofenceInclude<ExtArgs> | null
  }


  /**
   * Model VehiclesOnGeofences
   */

  export type AggregateVehiclesOnGeofences = {
    _count: VehiclesOnGeofencesCountAggregateOutputType | null
    _min: VehiclesOnGeofencesMinAggregateOutputType | null
    _max: VehiclesOnGeofencesMaxAggregateOutputType | null
  }

  export type VehiclesOnGeofencesMinAggregateOutputType = {
    vehicleId: string | null
    geofenceId: string | null
    assignedAt: Date | null
  }

  export type VehiclesOnGeofencesMaxAggregateOutputType = {
    vehicleId: string | null
    geofenceId: string | null
    assignedAt: Date | null
  }

  export type VehiclesOnGeofencesCountAggregateOutputType = {
    vehicleId: number
    geofenceId: number
    assignedAt: number
    _all: number
  }


  export type VehiclesOnGeofencesMinAggregateInputType = {
    vehicleId?: true
    geofenceId?: true
    assignedAt?: true
  }

  export type VehiclesOnGeofencesMaxAggregateInputType = {
    vehicleId?: true
    geofenceId?: true
    assignedAt?: true
  }

  export type VehiclesOnGeofencesCountAggregateInputType = {
    vehicleId?: true
    geofenceId?: true
    assignedAt?: true
    _all?: true
  }

  export type VehiclesOnGeofencesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VehiclesOnGeofences to aggregate.
     */
    where?: VehiclesOnGeofencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VehiclesOnGeofences to fetch.
     */
    orderBy?: VehiclesOnGeofencesOrderByWithRelationInput | VehiclesOnGeofencesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VehiclesOnGeofencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VehiclesOnGeofences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VehiclesOnGeofences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VehiclesOnGeofences
    **/
    _count?: true | VehiclesOnGeofencesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VehiclesOnGeofencesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VehiclesOnGeofencesMaxAggregateInputType
  }

  export type GetVehiclesOnGeofencesAggregateType<T extends VehiclesOnGeofencesAggregateArgs> = {
        [P in keyof T & keyof AggregateVehiclesOnGeofences]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVehiclesOnGeofences[P]>
      : GetScalarType<T[P], AggregateVehiclesOnGeofences[P]>
  }




  export type VehiclesOnGeofencesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VehiclesOnGeofencesWhereInput
    orderBy?: VehiclesOnGeofencesOrderByWithAggregationInput | VehiclesOnGeofencesOrderByWithAggregationInput[]
    by: VehiclesOnGeofencesScalarFieldEnum[] | VehiclesOnGeofencesScalarFieldEnum
    having?: VehiclesOnGeofencesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VehiclesOnGeofencesCountAggregateInputType | true
    _min?: VehiclesOnGeofencesMinAggregateInputType
    _max?: VehiclesOnGeofencesMaxAggregateInputType
  }

  export type VehiclesOnGeofencesGroupByOutputType = {
    vehicleId: string
    geofenceId: string
    assignedAt: Date
    _count: VehiclesOnGeofencesCountAggregateOutputType | null
    _min: VehiclesOnGeofencesMinAggregateOutputType | null
    _max: VehiclesOnGeofencesMaxAggregateOutputType | null
  }

  type GetVehiclesOnGeofencesGroupByPayload<T extends VehiclesOnGeofencesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VehiclesOnGeofencesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VehiclesOnGeofencesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VehiclesOnGeofencesGroupByOutputType[P]>
            : GetScalarType<T[P], VehiclesOnGeofencesGroupByOutputType[P]>
        }
      >
    >


  export type VehiclesOnGeofencesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    vehicleId?: boolean
    geofenceId?: boolean
    assignedAt?: boolean
    vehicle?: boolean | VehicleInfoDefaultArgs<ExtArgs>
    geofence?: boolean | GeofenceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vehiclesOnGeofences"]>

  export type VehiclesOnGeofencesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    vehicleId?: boolean
    geofenceId?: boolean
    assignedAt?: boolean
    vehicle?: boolean | VehicleInfoDefaultArgs<ExtArgs>
    geofence?: boolean | GeofenceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vehiclesOnGeofences"]>

  export type VehiclesOnGeofencesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    vehicleId?: boolean
    geofenceId?: boolean
    assignedAt?: boolean
    vehicle?: boolean | VehicleInfoDefaultArgs<ExtArgs>
    geofence?: boolean | GeofenceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vehiclesOnGeofences"]>

  export type VehiclesOnGeofencesSelectScalar = {
    vehicleId?: boolean
    geofenceId?: boolean
    assignedAt?: boolean
  }

  export type VehiclesOnGeofencesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"vehicleId" | "geofenceId" | "assignedAt", ExtArgs["result"]["vehiclesOnGeofences"]>
  export type VehiclesOnGeofencesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle?: boolean | VehicleInfoDefaultArgs<ExtArgs>
    geofence?: boolean | GeofenceDefaultArgs<ExtArgs>
  }
  export type VehiclesOnGeofencesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle?: boolean | VehicleInfoDefaultArgs<ExtArgs>
    geofence?: boolean | GeofenceDefaultArgs<ExtArgs>
  }
  export type VehiclesOnGeofencesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle?: boolean | VehicleInfoDefaultArgs<ExtArgs>
    geofence?: boolean | GeofenceDefaultArgs<ExtArgs>
  }

  export type $VehiclesOnGeofencesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VehiclesOnGeofences"
    objects: {
      vehicle: Prisma.$VehicleInfoPayload<ExtArgs>
      geofence: Prisma.$GeofencePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      vehicleId: string
      geofenceId: string
      assignedAt: Date
    }, ExtArgs["result"]["vehiclesOnGeofences"]>
    composites: {}
  }

  type VehiclesOnGeofencesGetPayload<S extends boolean | null | undefined | VehiclesOnGeofencesDefaultArgs> = $Result.GetResult<Prisma.$VehiclesOnGeofencesPayload, S>

  type VehiclesOnGeofencesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VehiclesOnGeofencesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VehiclesOnGeofencesCountAggregateInputType | true
    }

  export interface VehiclesOnGeofencesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VehiclesOnGeofences'], meta: { name: 'VehiclesOnGeofences' } }
    /**
     * Find zero or one VehiclesOnGeofences that matches the filter.
     * @param {VehiclesOnGeofencesFindUniqueArgs} args - Arguments to find a VehiclesOnGeofences
     * @example
     * // Get one VehiclesOnGeofences
     * const vehiclesOnGeofences = await prisma.vehiclesOnGeofences.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VehiclesOnGeofencesFindUniqueArgs>(args: SelectSubset<T, VehiclesOnGeofencesFindUniqueArgs<ExtArgs>>): Prisma__VehiclesOnGeofencesClient<$Result.GetResult<Prisma.$VehiclesOnGeofencesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VehiclesOnGeofences that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VehiclesOnGeofencesFindUniqueOrThrowArgs} args - Arguments to find a VehiclesOnGeofences
     * @example
     * // Get one VehiclesOnGeofences
     * const vehiclesOnGeofences = await prisma.vehiclesOnGeofences.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VehiclesOnGeofencesFindUniqueOrThrowArgs>(args: SelectSubset<T, VehiclesOnGeofencesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VehiclesOnGeofencesClient<$Result.GetResult<Prisma.$VehiclesOnGeofencesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VehiclesOnGeofences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehiclesOnGeofencesFindFirstArgs} args - Arguments to find a VehiclesOnGeofences
     * @example
     * // Get one VehiclesOnGeofences
     * const vehiclesOnGeofences = await prisma.vehiclesOnGeofences.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VehiclesOnGeofencesFindFirstArgs>(args?: SelectSubset<T, VehiclesOnGeofencesFindFirstArgs<ExtArgs>>): Prisma__VehiclesOnGeofencesClient<$Result.GetResult<Prisma.$VehiclesOnGeofencesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VehiclesOnGeofences that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehiclesOnGeofencesFindFirstOrThrowArgs} args - Arguments to find a VehiclesOnGeofences
     * @example
     * // Get one VehiclesOnGeofences
     * const vehiclesOnGeofences = await prisma.vehiclesOnGeofences.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VehiclesOnGeofencesFindFirstOrThrowArgs>(args?: SelectSubset<T, VehiclesOnGeofencesFindFirstOrThrowArgs<ExtArgs>>): Prisma__VehiclesOnGeofencesClient<$Result.GetResult<Prisma.$VehiclesOnGeofencesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VehiclesOnGeofences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehiclesOnGeofencesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VehiclesOnGeofences
     * const vehiclesOnGeofences = await prisma.vehiclesOnGeofences.findMany()
     * 
     * // Get first 10 VehiclesOnGeofences
     * const vehiclesOnGeofences = await prisma.vehiclesOnGeofences.findMany({ take: 10 })
     * 
     * // Only select the `vehicleId`
     * const vehiclesOnGeofencesWithVehicleIdOnly = await prisma.vehiclesOnGeofences.findMany({ select: { vehicleId: true } })
     * 
     */
    findMany<T extends VehiclesOnGeofencesFindManyArgs>(args?: SelectSubset<T, VehiclesOnGeofencesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehiclesOnGeofencesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VehiclesOnGeofences.
     * @param {VehiclesOnGeofencesCreateArgs} args - Arguments to create a VehiclesOnGeofences.
     * @example
     * // Create one VehiclesOnGeofences
     * const VehiclesOnGeofences = await prisma.vehiclesOnGeofences.create({
     *   data: {
     *     // ... data to create a VehiclesOnGeofences
     *   }
     * })
     * 
     */
    create<T extends VehiclesOnGeofencesCreateArgs>(args: SelectSubset<T, VehiclesOnGeofencesCreateArgs<ExtArgs>>): Prisma__VehiclesOnGeofencesClient<$Result.GetResult<Prisma.$VehiclesOnGeofencesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VehiclesOnGeofences.
     * @param {VehiclesOnGeofencesCreateManyArgs} args - Arguments to create many VehiclesOnGeofences.
     * @example
     * // Create many VehiclesOnGeofences
     * const vehiclesOnGeofences = await prisma.vehiclesOnGeofences.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VehiclesOnGeofencesCreateManyArgs>(args?: SelectSubset<T, VehiclesOnGeofencesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VehiclesOnGeofences and returns the data saved in the database.
     * @param {VehiclesOnGeofencesCreateManyAndReturnArgs} args - Arguments to create many VehiclesOnGeofences.
     * @example
     * // Create many VehiclesOnGeofences
     * const vehiclesOnGeofences = await prisma.vehiclesOnGeofences.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VehiclesOnGeofences and only return the `vehicleId`
     * const vehiclesOnGeofencesWithVehicleIdOnly = await prisma.vehiclesOnGeofences.createManyAndReturn({
     *   select: { vehicleId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VehiclesOnGeofencesCreateManyAndReturnArgs>(args?: SelectSubset<T, VehiclesOnGeofencesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehiclesOnGeofencesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VehiclesOnGeofences.
     * @param {VehiclesOnGeofencesDeleteArgs} args - Arguments to delete one VehiclesOnGeofences.
     * @example
     * // Delete one VehiclesOnGeofences
     * const VehiclesOnGeofences = await prisma.vehiclesOnGeofences.delete({
     *   where: {
     *     // ... filter to delete one VehiclesOnGeofences
     *   }
     * })
     * 
     */
    delete<T extends VehiclesOnGeofencesDeleteArgs>(args: SelectSubset<T, VehiclesOnGeofencesDeleteArgs<ExtArgs>>): Prisma__VehiclesOnGeofencesClient<$Result.GetResult<Prisma.$VehiclesOnGeofencesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VehiclesOnGeofences.
     * @param {VehiclesOnGeofencesUpdateArgs} args - Arguments to update one VehiclesOnGeofences.
     * @example
     * // Update one VehiclesOnGeofences
     * const vehiclesOnGeofences = await prisma.vehiclesOnGeofences.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VehiclesOnGeofencesUpdateArgs>(args: SelectSubset<T, VehiclesOnGeofencesUpdateArgs<ExtArgs>>): Prisma__VehiclesOnGeofencesClient<$Result.GetResult<Prisma.$VehiclesOnGeofencesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VehiclesOnGeofences.
     * @param {VehiclesOnGeofencesDeleteManyArgs} args - Arguments to filter VehiclesOnGeofences to delete.
     * @example
     * // Delete a few VehiclesOnGeofences
     * const { count } = await prisma.vehiclesOnGeofences.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VehiclesOnGeofencesDeleteManyArgs>(args?: SelectSubset<T, VehiclesOnGeofencesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VehiclesOnGeofences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehiclesOnGeofencesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VehiclesOnGeofences
     * const vehiclesOnGeofences = await prisma.vehiclesOnGeofences.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VehiclesOnGeofencesUpdateManyArgs>(args: SelectSubset<T, VehiclesOnGeofencesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VehiclesOnGeofences and returns the data updated in the database.
     * @param {VehiclesOnGeofencesUpdateManyAndReturnArgs} args - Arguments to update many VehiclesOnGeofences.
     * @example
     * // Update many VehiclesOnGeofences
     * const vehiclesOnGeofences = await prisma.vehiclesOnGeofences.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VehiclesOnGeofences and only return the `vehicleId`
     * const vehiclesOnGeofencesWithVehicleIdOnly = await prisma.vehiclesOnGeofences.updateManyAndReturn({
     *   select: { vehicleId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VehiclesOnGeofencesUpdateManyAndReturnArgs>(args: SelectSubset<T, VehiclesOnGeofencesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehiclesOnGeofencesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VehiclesOnGeofences.
     * @param {VehiclesOnGeofencesUpsertArgs} args - Arguments to update or create a VehiclesOnGeofences.
     * @example
     * // Update or create a VehiclesOnGeofences
     * const vehiclesOnGeofences = await prisma.vehiclesOnGeofences.upsert({
     *   create: {
     *     // ... data to create a VehiclesOnGeofences
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VehiclesOnGeofences we want to update
     *   }
     * })
     */
    upsert<T extends VehiclesOnGeofencesUpsertArgs>(args: SelectSubset<T, VehiclesOnGeofencesUpsertArgs<ExtArgs>>): Prisma__VehiclesOnGeofencesClient<$Result.GetResult<Prisma.$VehiclesOnGeofencesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VehiclesOnGeofences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehiclesOnGeofencesCountArgs} args - Arguments to filter VehiclesOnGeofences to count.
     * @example
     * // Count the number of VehiclesOnGeofences
     * const count = await prisma.vehiclesOnGeofences.count({
     *   where: {
     *     // ... the filter for the VehiclesOnGeofences we want to count
     *   }
     * })
    **/
    count<T extends VehiclesOnGeofencesCountArgs>(
      args?: Subset<T, VehiclesOnGeofencesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VehiclesOnGeofencesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VehiclesOnGeofences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehiclesOnGeofencesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VehiclesOnGeofencesAggregateArgs>(args: Subset<T, VehiclesOnGeofencesAggregateArgs>): Prisma.PrismaPromise<GetVehiclesOnGeofencesAggregateType<T>>

    /**
     * Group by VehiclesOnGeofences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehiclesOnGeofencesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VehiclesOnGeofencesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VehiclesOnGeofencesGroupByArgs['orderBy'] }
        : { orderBy?: VehiclesOnGeofencesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VehiclesOnGeofencesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVehiclesOnGeofencesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VehiclesOnGeofences model
   */
  readonly fields: VehiclesOnGeofencesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VehiclesOnGeofences.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VehiclesOnGeofencesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    vehicle<T extends VehicleInfoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VehicleInfoDefaultArgs<ExtArgs>>): Prisma__VehicleInfoClient<$Result.GetResult<Prisma.$VehicleInfoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    geofence<T extends GeofenceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GeofenceDefaultArgs<ExtArgs>>): Prisma__GeofenceClient<$Result.GetResult<Prisma.$GeofencePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VehiclesOnGeofences model
   */
  interface VehiclesOnGeofencesFieldRefs {
    readonly vehicleId: FieldRef<"VehiclesOnGeofences", 'String'>
    readonly geofenceId: FieldRef<"VehiclesOnGeofences", 'String'>
    readonly assignedAt: FieldRef<"VehiclesOnGeofences", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VehiclesOnGeofences findUnique
   */
  export type VehiclesOnGeofencesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehiclesOnGeofences
     */
    select?: VehiclesOnGeofencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehiclesOnGeofences
     */
    omit?: VehiclesOnGeofencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehiclesOnGeofencesInclude<ExtArgs> | null
    /**
     * Filter, which VehiclesOnGeofences to fetch.
     */
    where: VehiclesOnGeofencesWhereUniqueInput
  }

  /**
   * VehiclesOnGeofences findUniqueOrThrow
   */
  export type VehiclesOnGeofencesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehiclesOnGeofences
     */
    select?: VehiclesOnGeofencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehiclesOnGeofences
     */
    omit?: VehiclesOnGeofencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehiclesOnGeofencesInclude<ExtArgs> | null
    /**
     * Filter, which VehiclesOnGeofences to fetch.
     */
    where: VehiclesOnGeofencesWhereUniqueInput
  }

  /**
   * VehiclesOnGeofences findFirst
   */
  export type VehiclesOnGeofencesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehiclesOnGeofences
     */
    select?: VehiclesOnGeofencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehiclesOnGeofences
     */
    omit?: VehiclesOnGeofencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehiclesOnGeofencesInclude<ExtArgs> | null
    /**
     * Filter, which VehiclesOnGeofences to fetch.
     */
    where?: VehiclesOnGeofencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VehiclesOnGeofences to fetch.
     */
    orderBy?: VehiclesOnGeofencesOrderByWithRelationInput | VehiclesOnGeofencesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VehiclesOnGeofences.
     */
    cursor?: VehiclesOnGeofencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VehiclesOnGeofences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VehiclesOnGeofences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VehiclesOnGeofences.
     */
    distinct?: VehiclesOnGeofencesScalarFieldEnum | VehiclesOnGeofencesScalarFieldEnum[]
  }

  /**
   * VehiclesOnGeofences findFirstOrThrow
   */
  export type VehiclesOnGeofencesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehiclesOnGeofences
     */
    select?: VehiclesOnGeofencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehiclesOnGeofences
     */
    omit?: VehiclesOnGeofencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehiclesOnGeofencesInclude<ExtArgs> | null
    /**
     * Filter, which VehiclesOnGeofences to fetch.
     */
    where?: VehiclesOnGeofencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VehiclesOnGeofences to fetch.
     */
    orderBy?: VehiclesOnGeofencesOrderByWithRelationInput | VehiclesOnGeofencesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VehiclesOnGeofences.
     */
    cursor?: VehiclesOnGeofencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VehiclesOnGeofences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VehiclesOnGeofences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VehiclesOnGeofences.
     */
    distinct?: VehiclesOnGeofencesScalarFieldEnum | VehiclesOnGeofencesScalarFieldEnum[]
  }

  /**
   * VehiclesOnGeofences findMany
   */
  export type VehiclesOnGeofencesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehiclesOnGeofences
     */
    select?: VehiclesOnGeofencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehiclesOnGeofences
     */
    omit?: VehiclesOnGeofencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehiclesOnGeofencesInclude<ExtArgs> | null
    /**
     * Filter, which VehiclesOnGeofences to fetch.
     */
    where?: VehiclesOnGeofencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VehiclesOnGeofences to fetch.
     */
    orderBy?: VehiclesOnGeofencesOrderByWithRelationInput | VehiclesOnGeofencesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VehiclesOnGeofences.
     */
    cursor?: VehiclesOnGeofencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VehiclesOnGeofences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VehiclesOnGeofences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VehiclesOnGeofences.
     */
    distinct?: VehiclesOnGeofencesScalarFieldEnum | VehiclesOnGeofencesScalarFieldEnum[]
  }

  /**
   * VehiclesOnGeofences create
   */
  export type VehiclesOnGeofencesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehiclesOnGeofences
     */
    select?: VehiclesOnGeofencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehiclesOnGeofences
     */
    omit?: VehiclesOnGeofencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehiclesOnGeofencesInclude<ExtArgs> | null
    /**
     * The data needed to create a VehiclesOnGeofences.
     */
    data: XOR<VehiclesOnGeofencesCreateInput, VehiclesOnGeofencesUncheckedCreateInput>
  }

  /**
   * VehiclesOnGeofences createMany
   */
  export type VehiclesOnGeofencesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VehiclesOnGeofences.
     */
    data: VehiclesOnGeofencesCreateManyInput | VehiclesOnGeofencesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VehiclesOnGeofences createManyAndReturn
   */
  export type VehiclesOnGeofencesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehiclesOnGeofences
     */
    select?: VehiclesOnGeofencesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VehiclesOnGeofences
     */
    omit?: VehiclesOnGeofencesOmit<ExtArgs> | null
    /**
     * The data used to create many VehiclesOnGeofences.
     */
    data: VehiclesOnGeofencesCreateManyInput | VehiclesOnGeofencesCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehiclesOnGeofencesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * VehiclesOnGeofences update
   */
  export type VehiclesOnGeofencesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehiclesOnGeofences
     */
    select?: VehiclesOnGeofencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehiclesOnGeofences
     */
    omit?: VehiclesOnGeofencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehiclesOnGeofencesInclude<ExtArgs> | null
    /**
     * The data needed to update a VehiclesOnGeofences.
     */
    data: XOR<VehiclesOnGeofencesUpdateInput, VehiclesOnGeofencesUncheckedUpdateInput>
    /**
     * Choose, which VehiclesOnGeofences to update.
     */
    where: VehiclesOnGeofencesWhereUniqueInput
  }

  /**
   * VehiclesOnGeofences updateMany
   */
  export type VehiclesOnGeofencesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VehiclesOnGeofences.
     */
    data: XOR<VehiclesOnGeofencesUpdateManyMutationInput, VehiclesOnGeofencesUncheckedUpdateManyInput>
    /**
     * Filter which VehiclesOnGeofences to update
     */
    where?: VehiclesOnGeofencesWhereInput
    /**
     * Limit how many VehiclesOnGeofences to update.
     */
    limit?: number
  }

  /**
   * VehiclesOnGeofences updateManyAndReturn
   */
  export type VehiclesOnGeofencesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehiclesOnGeofences
     */
    select?: VehiclesOnGeofencesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VehiclesOnGeofences
     */
    omit?: VehiclesOnGeofencesOmit<ExtArgs> | null
    /**
     * The data used to update VehiclesOnGeofences.
     */
    data: XOR<VehiclesOnGeofencesUpdateManyMutationInput, VehiclesOnGeofencesUncheckedUpdateManyInput>
    /**
     * Filter which VehiclesOnGeofences to update
     */
    where?: VehiclesOnGeofencesWhereInput
    /**
     * Limit how many VehiclesOnGeofences to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehiclesOnGeofencesIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * VehiclesOnGeofences upsert
   */
  export type VehiclesOnGeofencesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehiclesOnGeofences
     */
    select?: VehiclesOnGeofencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehiclesOnGeofences
     */
    omit?: VehiclesOnGeofencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehiclesOnGeofencesInclude<ExtArgs> | null
    /**
     * The filter to search for the VehiclesOnGeofences to update in case it exists.
     */
    where: VehiclesOnGeofencesWhereUniqueInput
    /**
     * In case the VehiclesOnGeofences found by the `where` argument doesn't exist, create a new VehiclesOnGeofences with this data.
     */
    create: XOR<VehiclesOnGeofencesCreateInput, VehiclesOnGeofencesUncheckedCreateInput>
    /**
     * In case the VehiclesOnGeofences was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VehiclesOnGeofencesUpdateInput, VehiclesOnGeofencesUncheckedUpdateInput>
  }

  /**
   * VehiclesOnGeofences delete
   */
  export type VehiclesOnGeofencesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehiclesOnGeofences
     */
    select?: VehiclesOnGeofencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehiclesOnGeofences
     */
    omit?: VehiclesOnGeofencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehiclesOnGeofencesInclude<ExtArgs> | null
    /**
     * Filter which VehiclesOnGeofences to delete.
     */
    where: VehiclesOnGeofencesWhereUniqueInput
  }

  /**
   * VehiclesOnGeofences deleteMany
   */
  export type VehiclesOnGeofencesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VehiclesOnGeofences to delete
     */
    where?: VehiclesOnGeofencesWhereInput
    /**
     * Limit how many VehiclesOnGeofences to delete.
     */
    limit?: number
  }

  /**
   * VehiclesOnGeofences without action
   */
  export type VehiclesOnGeofencesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehiclesOnGeofences
     */
    select?: VehiclesOnGeofencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehiclesOnGeofences
     */
    omit?: VehiclesOnGeofencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehiclesOnGeofencesInclude<ExtArgs> | null
  }


  /**
   * Model VehicleCompliance
   */

  export type AggregateVehicleCompliance = {
    _count: VehicleComplianceCountAggregateOutputType | null
    _avg: VehicleComplianceAvgAggregateOutputType | null
    _sum: VehicleComplianceSumAggregateOutputType | null
    _min: VehicleComplianceMinAggregateOutputType | null
    _max: VehicleComplianceMaxAggregateOutputType | null
  }

  export type VehicleComplianceAvgAggregateOutputType = {
    fuelQuantity: Decimal | null
    fuelRate: Decimal | null
    totalCost: Decimal | null
    filledLat: Decimal | null
    filledLng: Decimal | null
  }

  export type VehicleComplianceSumAggregateOutputType = {
    fuelQuantity: Decimal | null
    fuelRate: Decimal | null
    totalCost: Decimal | null
    filledLat: Decimal | null
    filledLng: Decimal | null
  }

  export type VehicleComplianceMinAggregateOutputType = {
    id: string | null
    vehicleId: string | null
    fuelQuantity: Decimal | null
    fuelRate: Decimal | null
    totalCost: Decimal | null
    filledLat: Decimal | null
    filledLng: Decimal | null
    filledAddress: string | null
    filledBy: string | null
    receiptUrl: string | null
    filledAt: Date | null
    createdAt: Date | null
  }

  export type VehicleComplianceMaxAggregateOutputType = {
    id: string | null
    vehicleId: string | null
    fuelQuantity: Decimal | null
    fuelRate: Decimal | null
    totalCost: Decimal | null
    filledLat: Decimal | null
    filledLng: Decimal | null
    filledAddress: string | null
    filledBy: string | null
    receiptUrl: string | null
    filledAt: Date | null
    createdAt: Date | null
  }

  export type VehicleComplianceCountAggregateOutputType = {
    id: number
    vehicleId: number
    fuelQuantity: number
    fuelRate: number
    totalCost: number
    filledLat: number
    filledLng: number
    filledAddress: number
    filledBy: number
    receiptUrl: number
    filledAt: number
    createdAt: number
    _all: number
  }


  export type VehicleComplianceAvgAggregateInputType = {
    fuelQuantity?: true
    fuelRate?: true
    totalCost?: true
    filledLat?: true
    filledLng?: true
  }

  export type VehicleComplianceSumAggregateInputType = {
    fuelQuantity?: true
    fuelRate?: true
    totalCost?: true
    filledLat?: true
    filledLng?: true
  }

  export type VehicleComplianceMinAggregateInputType = {
    id?: true
    vehicleId?: true
    fuelQuantity?: true
    fuelRate?: true
    totalCost?: true
    filledLat?: true
    filledLng?: true
    filledAddress?: true
    filledBy?: true
    receiptUrl?: true
    filledAt?: true
    createdAt?: true
  }

  export type VehicleComplianceMaxAggregateInputType = {
    id?: true
    vehicleId?: true
    fuelQuantity?: true
    fuelRate?: true
    totalCost?: true
    filledLat?: true
    filledLng?: true
    filledAddress?: true
    filledBy?: true
    receiptUrl?: true
    filledAt?: true
    createdAt?: true
  }

  export type VehicleComplianceCountAggregateInputType = {
    id?: true
    vehicleId?: true
    fuelQuantity?: true
    fuelRate?: true
    totalCost?: true
    filledLat?: true
    filledLng?: true
    filledAddress?: true
    filledBy?: true
    receiptUrl?: true
    filledAt?: true
    createdAt?: true
    _all?: true
  }

  export type VehicleComplianceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VehicleCompliance to aggregate.
     */
    where?: VehicleComplianceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VehicleCompliances to fetch.
     */
    orderBy?: VehicleComplianceOrderByWithRelationInput | VehicleComplianceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VehicleComplianceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VehicleCompliances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VehicleCompliances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VehicleCompliances
    **/
    _count?: true | VehicleComplianceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VehicleComplianceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VehicleComplianceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VehicleComplianceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VehicleComplianceMaxAggregateInputType
  }

  export type GetVehicleComplianceAggregateType<T extends VehicleComplianceAggregateArgs> = {
        [P in keyof T & keyof AggregateVehicleCompliance]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVehicleCompliance[P]>
      : GetScalarType<T[P], AggregateVehicleCompliance[P]>
  }




  export type VehicleComplianceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VehicleComplianceWhereInput
    orderBy?: VehicleComplianceOrderByWithAggregationInput | VehicleComplianceOrderByWithAggregationInput[]
    by: VehicleComplianceScalarFieldEnum[] | VehicleComplianceScalarFieldEnum
    having?: VehicleComplianceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VehicleComplianceCountAggregateInputType | true
    _avg?: VehicleComplianceAvgAggregateInputType
    _sum?: VehicleComplianceSumAggregateInputType
    _min?: VehicleComplianceMinAggregateInputType
    _max?: VehicleComplianceMaxAggregateInputType
  }

  export type VehicleComplianceGroupByOutputType = {
    id: string
    vehicleId: string
    fuelQuantity: Decimal
    fuelRate: Decimal
    totalCost: Decimal
    filledLat: Decimal | null
    filledLng: Decimal | null
    filledAddress: string | null
    filledBy: string
    receiptUrl: string | null
    filledAt: Date
    createdAt: Date
    _count: VehicleComplianceCountAggregateOutputType | null
    _avg: VehicleComplianceAvgAggregateOutputType | null
    _sum: VehicleComplianceSumAggregateOutputType | null
    _min: VehicleComplianceMinAggregateOutputType | null
    _max: VehicleComplianceMaxAggregateOutputType | null
  }

  type GetVehicleComplianceGroupByPayload<T extends VehicleComplianceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VehicleComplianceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VehicleComplianceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VehicleComplianceGroupByOutputType[P]>
            : GetScalarType<T[P], VehicleComplianceGroupByOutputType[P]>
        }
      >
    >


  export type VehicleComplianceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vehicleId?: boolean
    fuelQuantity?: boolean
    fuelRate?: boolean
    totalCost?: boolean
    filledLat?: boolean
    filledLng?: boolean
    filledAddress?: boolean
    filledBy?: boolean
    receiptUrl?: boolean
    filledAt?: boolean
    createdAt?: boolean
    vehicle?: boolean | VehicleInfoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vehicleCompliance"]>

  export type VehicleComplianceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vehicleId?: boolean
    fuelQuantity?: boolean
    fuelRate?: boolean
    totalCost?: boolean
    filledLat?: boolean
    filledLng?: boolean
    filledAddress?: boolean
    filledBy?: boolean
    receiptUrl?: boolean
    filledAt?: boolean
    createdAt?: boolean
    vehicle?: boolean | VehicleInfoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vehicleCompliance"]>

  export type VehicleComplianceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vehicleId?: boolean
    fuelQuantity?: boolean
    fuelRate?: boolean
    totalCost?: boolean
    filledLat?: boolean
    filledLng?: boolean
    filledAddress?: boolean
    filledBy?: boolean
    receiptUrl?: boolean
    filledAt?: boolean
    createdAt?: boolean
    vehicle?: boolean | VehicleInfoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vehicleCompliance"]>

  export type VehicleComplianceSelectScalar = {
    id?: boolean
    vehicleId?: boolean
    fuelQuantity?: boolean
    fuelRate?: boolean
    totalCost?: boolean
    filledLat?: boolean
    filledLng?: boolean
    filledAddress?: boolean
    filledBy?: boolean
    receiptUrl?: boolean
    filledAt?: boolean
    createdAt?: boolean
  }

  export type VehicleComplianceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "vehicleId" | "fuelQuantity" | "fuelRate" | "totalCost" | "filledLat" | "filledLng" | "filledAddress" | "filledBy" | "receiptUrl" | "filledAt" | "createdAt", ExtArgs["result"]["vehicleCompliance"]>
  export type VehicleComplianceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle?: boolean | VehicleInfoDefaultArgs<ExtArgs>
  }
  export type VehicleComplianceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle?: boolean | VehicleInfoDefaultArgs<ExtArgs>
  }
  export type VehicleComplianceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle?: boolean | VehicleInfoDefaultArgs<ExtArgs>
  }

  export type $VehicleCompliancePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VehicleCompliance"
    objects: {
      vehicle: Prisma.$VehicleInfoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      vehicleId: string
      fuelQuantity: Prisma.Decimal
      fuelRate: Prisma.Decimal
      totalCost: Prisma.Decimal
      filledLat: Prisma.Decimal | null
      filledLng: Prisma.Decimal | null
      filledAddress: string | null
      filledBy: string
      receiptUrl: string | null
      filledAt: Date
      createdAt: Date
    }, ExtArgs["result"]["vehicleCompliance"]>
    composites: {}
  }

  type VehicleComplianceGetPayload<S extends boolean | null | undefined | VehicleComplianceDefaultArgs> = $Result.GetResult<Prisma.$VehicleCompliancePayload, S>

  type VehicleComplianceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VehicleComplianceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VehicleComplianceCountAggregateInputType | true
    }

  export interface VehicleComplianceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VehicleCompliance'], meta: { name: 'VehicleCompliance' } }
    /**
     * Find zero or one VehicleCompliance that matches the filter.
     * @param {VehicleComplianceFindUniqueArgs} args - Arguments to find a VehicleCompliance
     * @example
     * // Get one VehicleCompliance
     * const vehicleCompliance = await prisma.vehicleCompliance.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VehicleComplianceFindUniqueArgs>(args: SelectSubset<T, VehicleComplianceFindUniqueArgs<ExtArgs>>): Prisma__VehicleComplianceClient<$Result.GetResult<Prisma.$VehicleCompliancePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VehicleCompliance that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VehicleComplianceFindUniqueOrThrowArgs} args - Arguments to find a VehicleCompliance
     * @example
     * // Get one VehicleCompliance
     * const vehicleCompliance = await prisma.vehicleCompliance.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VehicleComplianceFindUniqueOrThrowArgs>(args: SelectSubset<T, VehicleComplianceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VehicleComplianceClient<$Result.GetResult<Prisma.$VehicleCompliancePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VehicleCompliance that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleComplianceFindFirstArgs} args - Arguments to find a VehicleCompliance
     * @example
     * // Get one VehicleCompliance
     * const vehicleCompliance = await prisma.vehicleCompliance.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VehicleComplianceFindFirstArgs>(args?: SelectSubset<T, VehicleComplianceFindFirstArgs<ExtArgs>>): Prisma__VehicleComplianceClient<$Result.GetResult<Prisma.$VehicleCompliancePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VehicleCompliance that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleComplianceFindFirstOrThrowArgs} args - Arguments to find a VehicleCompliance
     * @example
     * // Get one VehicleCompliance
     * const vehicleCompliance = await prisma.vehicleCompliance.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VehicleComplianceFindFirstOrThrowArgs>(args?: SelectSubset<T, VehicleComplianceFindFirstOrThrowArgs<ExtArgs>>): Prisma__VehicleComplianceClient<$Result.GetResult<Prisma.$VehicleCompliancePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VehicleCompliances that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleComplianceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VehicleCompliances
     * const vehicleCompliances = await prisma.vehicleCompliance.findMany()
     * 
     * // Get first 10 VehicleCompliances
     * const vehicleCompliances = await prisma.vehicleCompliance.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vehicleComplianceWithIdOnly = await prisma.vehicleCompliance.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VehicleComplianceFindManyArgs>(args?: SelectSubset<T, VehicleComplianceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehicleCompliancePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VehicleCompliance.
     * @param {VehicleComplianceCreateArgs} args - Arguments to create a VehicleCompliance.
     * @example
     * // Create one VehicleCompliance
     * const VehicleCompliance = await prisma.vehicleCompliance.create({
     *   data: {
     *     // ... data to create a VehicleCompliance
     *   }
     * })
     * 
     */
    create<T extends VehicleComplianceCreateArgs>(args: SelectSubset<T, VehicleComplianceCreateArgs<ExtArgs>>): Prisma__VehicleComplianceClient<$Result.GetResult<Prisma.$VehicleCompliancePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VehicleCompliances.
     * @param {VehicleComplianceCreateManyArgs} args - Arguments to create many VehicleCompliances.
     * @example
     * // Create many VehicleCompliances
     * const vehicleCompliance = await prisma.vehicleCompliance.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VehicleComplianceCreateManyArgs>(args?: SelectSubset<T, VehicleComplianceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VehicleCompliances and returns the data saved in the database.
     * @param {VehicleComplianceCreateManyAndReturnArgs} args - Arguments to create many VehicleCompliances.
     * @example
     * // Create many VehicleCompliances
     * const vehicleCompliance = await prisma.vehicleCompliance.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VehicleCompliances and only return the `id`
     * const vehicleComplianceWithIdOnly = await prisma.vehicleCompliance.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VehicleComplianceCreateManyAndReturnArgs>(args?: SelectSubset<T, VehicleComplianceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehicleCompliancePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VehicleCompliance.
     * @param {VehicleComplianceDeleteArgs} args - Arguments to delete one VehicleCompliance.
     * @example
     * // Delete one VehicleCompliance
     * const VehicleCompliance = await prisma.vehicleCompliance.delete({
     *   where: {
     *     // ... filter to delete one VehicleCompliance
     *   }
     * })
     * 
     */
    delete<T extends VehicleComplianceDeleteArgs>(args: SelectSubset<T, VehicleComplianceDeleteArgs<ExtArgs>>): Prisma__VehicleComplianceClient<$Result.GetResult<Prisma.$VehicleCompliancePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VehicleCompliance.
     * @param {VehicleComplianceUpdateArgs} args - Arguments to update one VehicleCompliance.
     * @example
     * // Update one VehicleCompliance
     * const vehicleCompliance = await prisma.vehicleCompliance.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VehicleComplianceUpdateArgs>(args: SelectSubset<T, VehicleComplianceUpdateArgs<ExtArgs>>): Prisma__VehicleComplianceClient<$Result.GetResult<Prisma.$VehicleCompliancePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VehicleCompliances.
     * @param {VehicleComplianceDeleteManyArgs} args - Arguments to filter VehicleCompliances to delete.
     * @example
     * // Delete a few VehicleCompliances
     * const { count } = await prisma.vehicleCompliance.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VehicleComplianceDeleteManyArgs>(args?: SelectSubset<T, VehicleComplianceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VehicleCompliances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleComplianceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VehicleCompliances
     * const vehicleCompliance = await prisma.vehicleCompliance.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VehicleComplianceUpdateManyArgs>(args: SelectSubset<T, VehicleComplianceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VehicleCompliances and returns the data updated in the database.
     * @param {VehicleComplianceUpdateManyAndReturnArgs} args - Arguments to update many VehicleCompliances.
     * @example
     * // Update many VehicleCompliances
     * const vehicleCompliance = await prisma.vehicleCompliance.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VehicleCompliances and only return the `id`
     * const vehicleComplianceWithIdOnly = await prisma.vehicleCompliance.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VehicleComplianceUpdateManyAndReturnArgs>(args: SelectSubset<T, VehicleComplianceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehicleCompliancePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VehicleCompliance.
     * @param {VehicleComplianceUpsertArgs} args - Arguments to update or create a VehicleCompliance.
     * @example
     * // Update or create a VehicleCompliance
     * const vehicleCompliance = await prisma.vehicleCompliance.upsert({
     *   create: {
     *     // ... data to create a VehicleCompliance
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VehicleCompliance we want to update
     *   }
     * })
     */
    upsert<T extends VehicleComplianceUpsertArgs>(args: SelectSubset<T, VehicleComplianceUpsertArgs<ExtArgs>>): Prisma__VehicleComplianceClient<$Result.GetResult<Prisma.$VehicleCompliancePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VehicleCompliances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleComplianceCountArgs} args - Arguments to filter VehicleCompliances to count.
     * @example
     * // Count the number of VehicleCompliances
     * const count = await prisma.vehicleCompliance.count({
     *   where: {
     *     // ... the filter for the VehicleCompliances we want to count
     *   }
     * })
    **/
    count<T extends VehicleComplianceCountArgs>(
      args?: Subset<T, VehicleComplianceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VehicleComplianceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VehicleCompliance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleComplianceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VehicleComplianceAggregateArgs>(args: Subset<T, VehicleComplianceAggregateArgs>): Prisma.PrismaPromise<GetVehicleComplianceAggregateType<T>>

    /**
     * Group by VehicleCompliance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleComplianceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VehicleComplianceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VehicleComplianceGroupByArgs['orderBy'] }
        : { orderBy?: VehicleComplianceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VehicleComplianceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVehicleComplianceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VehicleCompliance model
   */
  readonly fields: VehicleComplianceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VehicleCompliance.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VehicleComplianceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    vehicle<T extends VehicleInfoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VehicleInfoDefaultArgs<ExtArgs>>): Prisma__VehicleInfoClient<$Result.GetResult<Prisma.$VehicleInfoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VehicleCompliance model
   */
  interface VehicleComplianceFieldRefs {
    readonly id: FieldRef<"VehicleCompliance", 'String'>
    readonly vehicleId: FieldRef<"VehicleCompliance", 'String'>
    readonly fuelQuantity: FieldRef<"VehicleCompliance", 'Decimal'>
    readonly fuelRate: FieldRef<"VehicleCompliance", 'Decimal'>
    readonly totalCost: FieldRef<"VehicleCompliance", 'Decimal'>
    readonly filledLat: FieldRef<"VehicleCompliance", 'Decimal'>
    readonly filledLng: FieldRef<"VehicleCompliance", 'Decimal'>
    readonly filledAddress: FieldRef<"VehicleCompliance", 'String'>
    readonly filledBy: FieldRef<"VehicleCompliance", 'String'>
    readonly receiptUrl: FieldRef<"VehicleCompliance", 'String'>
    readonly filledAt: FieldRef<"VehicleCompliance", 'DateTime'>
    readonly createdAt: FieldRef<"VehicleCompliance", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VehicleCompliance findUnique
   */
  export type VehicleComplianceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleCompliance
     */
    select?: VehicleComplianceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleCompliance
     */
    omit?: VehicleComplianceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleComplianceInclude<ExtArgs> | null
    /**
     * Filter, which VehicleCompliance to fetch.
     */
    where: VehicleComplianceWhereUniqueInput
  }

  /**
   * VehicleCompliance findUniqueOrThrow
   */
  export type VehicleComplianceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleCompliance
     */
    select?: VehicleComplianceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleCompliance
     */
    omit?: VehicleComplianceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleComplianceInclude<ExtArgs> | null
    /**
     * Filter, which VehicleCompliance to fetch.
     */
    where: VehicleComplianceWhereUniqueInput
  }

  /**
   * VehicleCompliance findFirst
   */
  export type VehicleComplianceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleCompliance
     */
    select?: VehicleComplianceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleCompliance
     */
    omit?: VehicleComplianceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleComplianceInclude<ExtArgs> | null
    /**
     * Filter, which VehicleCompliance to fetch.
     */
    where?: VehicleComplianceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VehicleCompliances to fetch.
     */
    orderBy?: VehicleComplianceOrderByWithRelationInput | VehicleComplianceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VehicleCompliances.
     */
    cursor?: VehicleComplianceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VehicleCompliances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VehicleCompliances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VehicleCompliances.
     */
    distinct?: VehicleComplianceScalarFieldEnum | VehicleComplianceScalarFieldEnum[]
  }

  /**
   * VehicleCompliance findFirstOrThrow
   */
  export type VehicleComplianceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleCompliance
     */
    select?: VehicleComplianceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleCompliance
     */
    omit?: VehicleComplianceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleComplianceInclude<ExtArgs> | null
    /**
     * Filter, which VehicleCompliance to fetch.
     */
    where?: VehicleComplianceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VehicleCompliances to fetch.
     */
    orderBy?: VehicleComplianceOrderByWithRelationInput | VehicleComplianceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VehicleCompliances.
     */
    cursor?: VehicleComplianceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VehicleCompliances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VehicleCompliances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VehicleCompliances.
     */
    distinct?: VehicleComplianceScalarFieldEnum | VehicleComplianceScalarFieldEnum[]
  }

  /**
   * VehicleCompliance findMany
   */
  export type VehicleComplianceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleCompliance
     */
    select?: VehicleComplianceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleCompliance
     */
    omit?: VehicleComplianceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleComplianceInclude<ExtArgs> | null
    /**
     * Filter, which VehicleCompliances to fetch.
     */
    where?: VehicleComplianceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VehicleCompliances to fetch.
     */
    orderBy?: VehicleComplianceOrderByWithRelationInput | VehicleComplianceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VehicleCompliances.
     */
    cursor?: VehicleComplianceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VehicleCompliances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VehicleCompliances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VehicleCompliances.
     */
    distinct?: VehicleComplianceScalarFieldEnum | VehicleComplianceScalarFieldEnum[]
  }

  /**
   * VehicleCompliance create
   */
  export type VehicleComplianceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleCompliance
     */
    select?: VehicleComplianceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleCompliance
     */
    omit?: VehicleComplianceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleComplianceInclude<ExtArgs> | null
    /**
     * The data needed to create a VehicleCompliance.
     */
    data: XOR<VehicleComplianceCreateInput, VehicleComplianceUncheckedCreateInput>
  }

  /**
   * VehicleCompliance createMany
   */
  export type VehicleComplianceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VehicleCompliances.
     */
    data: VehicleComplianceCreateManyInput | VehicleComplianceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VehicleCompliance createManyAndReturn
   */
  export type VehicleComplianceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleCompliance
     */
    select?: VehicleComplianceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleCompliance
     */
    omit?: VehicleComplianceOmit<ExtArgs> | null
    /**
     * The data used to create many VehicleCompliances.
     */
    data: VehicleComplianceCreateManyInput | VehicleComplianceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleComplianceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * VehicleCompliance update
   */
  export type VehicleComplianceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleCompliance
     */
    select?: VehicleComplianceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleCompliance
     */
    omit?: VehicleComplianceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleComplianceInclude<ExtArgs> | null
    /**
     * The data needed to update a VehicleCompliance.
     */
    data: XOR<VehicleComplianceUpdateInput, VehicleComplianceUncheckedUpdateInput>
    /**
     * Choose, which VehicleCompliance to update.
     */
    where: VehicleComplianceWhereUniqueInput
  }

  /**
   * VehicleCompliance updateMany
   */
  export type VehicleComplianceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VehicleCompliances.
     */
    data: XOR<VehicleComplianceUpdateManyMutationInput, VehicleComplianceUncheckedUpdateManyInput>
    /**
     * Filter which VehicleCompliances to update
     */
    where?: VehicleComplianceWhereInput
    /**
     * Limit how many VehicleCompliances to update.
     */
    limit?: number
  }

  /**
   * VehicleCompliance updateManyAndReturn
   */
  export type VehicleComplianceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleCompliance
     */
    select?: VehicleComplianceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleCompliance
     */
    omit?: VehicleComplianceOmit<ExtArgs> | null
    /**
     * The data used to update VehicleCompliances.
     */
    data: XOR<VehicleComplianceUpdateManyMutationInput, VehicleComplianceUncheckedUpdateManyInput>
    /**
     * Filter which VehicleCompliances to update
     */
    where?: VehicleComplianceWhereInput
    /**
     * Limit how many VehicleCompliances to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleComplianceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * VehicleCompliance upsert
   */
  export type VehicleComplianceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleCompliance
     */
    select?: VehicleComplianceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleCompliance
     */
    omit?: VehicleComplianceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleComplianceInclude<ExtArgs> | null
    /**
     * The filter to search for the VehicleCompliance to update in case it exists.
     */
    where: VehicleComplianceWhereUniqueInput
    /**
     * In case the VehicleCompliance found by the `where` argument doesn't exist, create a new VehicleCompliance with this data.
     */
    create: XOR<VehicleComplianceCreateInput, VehicleComplianceUncheckedCreateInput>
    /**
     * In case the VehicleCompliance was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VehicleComplianceUpdateInput, VehicleComplianceUncheckedUpdateInput>
  }

  /**
   * VehicleCompliance delete
   */
  export type VehicleComplianceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleCompliance
     */
    select?: VehicleComplianceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleCompliance
     */
    omit?: VehicleComplianceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleComplianceInclude<ExtArgs> | null
    /**
     * Filter which VehicleCompliance to delete.
     */
    where: VehicleComplianceWhereUniqueInput
  }

  /**
   * VehicleCompliance deleteMany
   */
  export type VehicleComplianceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VehicleCompliances to delete
     */
    where?: VehicleComplianceWhereInput
    /**
     * Limit how many VehicleCompliances to delete.
     */
    limit?: number
  }

  /**
   * VehicleCompliance without action
   */
  export type VehicleComplianceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleCompliance
     */
    select?: VehicleComplianceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleCompliance
     */
    omit?: VehicleComplianceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleComplianceInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const VehicleInfoScalarFieldEnum: {
    id: 'id',
    imei: 'imei',
    vechicleNumb: 'vechicleNumb',
    customerId: 'customerId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VehicleInfoScalarFieldEnum = (typeof VehicleInfoScalarFieldEnum)[keyof typeof VehicleInfoScalarFieldEnum]


  export const LocationLogScalarFieldEnum: {
    id: 'id',
    imei: 'imei',
    lat: 'lat',
    lng: 'lng',
    altitude: 'altitude',
    speed: 'speed',
    heading: 'heading',
    batteryVoltage: 'batteryVoltage',
    ignition: 'ignition',
    timestamp: 'timestamp',
    createdAt: 'createdAt'
  };

  export type LocationLogScalarFieldEnum = (typeof LocationLogScalarFieldEnum)[keyof typeof LocationLogScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const GeofenceScalarFieldEnum: {
    id: 'id',
    name: 'name',
    zoneHash: 'zoneHash',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type GeofenceScalarFieldEnum = (typeof GeofenceScalarFieldEnum)[keyof typeof GeofenceScalarFieldEnum]


  export const VehiclesOnGeofencesScalarFieldEnum: {
    vehicleId: 'vehicleId',
    geofenceId: 'geofenceId',
    assignedAt: 'assignedAt'
  };

  export type VehiclesOnGeofencesScalarFieldEnum = (typeof VehiclesOnGeofencesScalarFieldEnum)[keyof typeof VehiclesOnGeofencesScalarFieldEnum]


  export const VehicleComplianceScalarFieldEnum: {
    id: 'id',
    vehicleId: 'vehicleId',
    fuelQuantity: 'fuelQuantity',
    fuelRate: 'fuelRate',
    totalCost: 'totalCost',
    filledLat: 'filledLat',
    filledLng: 'filledLng',
    filledAddress: 'filledAddress',
    filledBy: 'filledBy',
    receiptUrl: 'receiptUrl',
    filledAt: 'filledAt',
    createdAt: 'createdAt'
  };

  export type VehicleComplianceScalarFieldEnum = (typeof VehicleComplianceScalarFieldEnum)[keyof typeof VehicleComplianceScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'userRole'
   */
  export type EnumuserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'userRole'>
    


  /**
   * Reference to a field of type 'userRole[]'
   */
  export type ListEnumuserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'userRole[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type VehicleInfoWhereInput = {
    AND?: VehicleInfoWhereInput | VehicleInfoWhereInput[]
    OR?: VehicleInfoWhereInput[]
    NOT?: VehicleInfoWhereInput | VehicleInfoWhereInput[]
    id?: UuidFilter<"VehicleInfo"> | string
    imei?: StringFilter<"VehicleInfo"> | string
    vechicleNumb?: StringFilter<"VehicleInfo"> | string
    customerId?: UuidFilter<"VehicleInfo"> | string
    createdAt?: DateTimeFilter<"VehicleInfo"> | Date | string
    updatedAt?: DateTimeFilter<"VehicleInfo"> | Date | string
    customer?: XOR<UserScalarRelationFilter, UserWhereInput>
    locations?: LocationLogListRelationFilter
    compliances?: VehicleComplianceListRelationFilter
    geofences?: VehiclesOnGeofencesListRelationFilter
  }

  export type VehicleInfoOrderByWithRelationInput = {
    id?: SortOrder
    imei?: SortOrder
    vechicleNumb?: SortOrder
    customerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    customer?: UserOrderByWithRelationInput
    locations?: LocationLogOrderByRelationAggregateInput
    compliances?: VehicleComplianceOrderByRelationAggregateInput
    geofences?: VehiclesOnGeofencesOrderByRelationAggregateInput
  }

  export type VehicleInfoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    imei?: string
    vechicleNumb?: string
    AND?: VehicleInfoWhereInput | VehicleInfoWhereInput[]
    OR?: VehicleInfoWhereInput[]
    NOT?: VehicleInfoWhereInput | VehicleInfoWhereInput[]
    customerId?: UuidFilter<"VehicleInfo"> | string
    createdAt?: DateTimeFilter<"VehicleInfo"> | Date | string
    updatedAt?: DateTimeFilter<"VehicleInfo"> | Date | string
    customer?: XOR<UserScalarRelationFilter, UserWhereInput>
    locations?: LocationLogListRelationFilter
    compliances?: VehicleComplianceListRelationFilter
    geofences?: VehiclesOnGeofencesListRelationFilter
  }, "id" | "imei" | "vechicleNumb">

  export type VehicleInfoOrderByWithAggregationInput = {
    id?: SortOrder
    imei?: SortOrder
    vechicleNumb?: SortOrder
    customerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VehicleInfoCountOrderByAggregateInput
    _max?: VehicleInfoMaxOrderByAggregateInput
    _min?: VehicleInfoMinOrderByAggregateInput
  }

  export type VehicleInfoScalarWhereWithAggregatesInput = {
    AND?: VehicleInfoScalarWhereWithAggregatesInput | VehicleInfoScalarWhereWithAggregatesInput[]
    OR?: VehicleInfoScalarWhereWithAggregatesInput[]
    NOT?: VehicleInfoScalarWhereWithAggregatesInput | VehicleInfoScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"VehicleInfo"> | string
    imei?: StringWithAggregatesFilter<"VehicleInfo"> | string
    vechicleNumb?: StringWithAggregatesFilter<"VehicleInfo"> | string
    customerId?: UuidWithAggregatesFilter<"VehicleInfo"> | string
    createdAt?: DateTimeWithAggregatesFilter<"VehicleInfo"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"VehicleInfo"> | Date | string
  }

  export type LocationLogWhereInput = {
    AND?: LocationLogWhereInput | LocationLogWhereInput[]
    OR?: LocationLogWhereInput[]
    NOT?: LocationLogWhereInput | LocationLogWhereInput[]
    id?: UuidFilter<"LocationLog"> | string
    imei?: StringFilter<"LocationLog"> | string
    lat?: DecimalFilter<"LocationLog"> | Decimal | DecimalJsLike | number | string
    lng?: DecimalFilter<"LocationLog"> | Decimal | DecimalJsLike | number | string
    altitude?: DecimalNullableFilter<"LocationLog"> | Decimal | DecimalJsLike | number | string | null
    speed?: DecimalNullableFilter<"LocationLog"> | Decimal | DecimalJsLike | number | string | null
    heading?: DecimalNullableFilter<"LocationLog"> | Decimal | DecimalJsLike | number | string | null
    batteryVoltage?: FloatNullableFilter<"LocationLog"> | number | null
    ignition?: BoolFilter<"LocationLog"> | boolean
    timestamp?: DateTimeFilter<"LocationLog"> | Date | string
    createdAt?: DateTimeFilter<"LocationLog"> | Date | string
    vehicle?: XOR<VehicleInfoScalarRelationFilter, VehicleInfoWhereInput>
  }

  export type LocationLogOrderByWithRelationInput = {
    id?: SortOrder
    imei?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    altitude?: SortOrderInput | SortOrder
    speed?: SortOrderInput | SortOrder
    heading?: SortOrderInput | SortOrder
    batteryVoltage?: SortOrderInput | SortOrder
    ignition?: SortOrder
    timestamp?: SortOrder
    createdAt?: SortOrder
    vehicle?: VehicleInfoOrderByWithRelationInput
  }

  export type LocationLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LocationLogWhereInput | LocationLogWhereInput[]
    OR?: LocationLogWhereInput[]
    NOT?: LocationLogWhereInput | LocationLogWhereInput[]
    imei?: StringFilter<"LocationLog"> | string
    lat?: DecimalFilter<"LocationLog"> | Decimal | DecimalJsLike | number | string
    lng?: DecimalFilter<"LocationLog"> | Decimal | DecimalJsLike | number | string
    altitude?: DecimalNullableFilter<"LocationLog"> | Decimal | DecimalJsLike | number | string | null
    speed?: DecimalNullableFilter<"LocationLog"> | Decimal | DecimalJsLike | number | string | null
    heading?: DecimalNullableFilter<"LocationLog"> | Decimal | DecimalJsLike | number | string | null
    batteryVoltage?: FloatNullableFilter<"LocationLog"> | number | null
    ignition?: BoolFilter<"LocationLog"> | boolean
    timestamp?: DateTimeFilter<"LocationLog"> | Date | string
    createdAt?: DateTimeFilter<"LocationLog"> | Date | string
    vehicle?: XOR<VehicleInfoScalarRelationFilter, VehicleInfoWhereInput>
  }, "id">

  export type LocationLogOrderByWithAggregationInput = {
    id?: SortOrder
    imei?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    altitude?: SortOrderInput | SortOrder
    speed?: SortOrderInput | SortOrder
    heading?: SortOrderInput | SortOrder
    batteryVoltage?: SortOrderInput | SortOrder
    ignition?: SortOrder
    timestamp?: SortOrder
    createdAt?: SortOrder
    _count?: LocationLogCountOrderByAggregateInput
    _avg?: LocationLogAvgOrderByAggregateInput
    _max?: LocationLogMaxOrderByAggregateInput
    _min?: LocationLogMinOrderByAggregateInput
    _sum?: LocationLogSumOrderByAggregateInput
  }

  export type LocationLogScalarWhereWithAggregatesInput = {
    AND?: LocationLogScalarWhereWithAggregatesInput | LocationLogScalarWhereWithAggregatesInput[]
    OR?: LocationLogScalarWhereWithAggregatesInput[]
    NOT?: LocationLogScalarWhereWithAggregatesInput | LocationLogScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"LocationLog"> | string
    imei?: StringWithAggregatesFilter<"LocationLog"> | string
    lat?: DecimalWithAggregatesFilter<"LocationLog"> | Decimal | DecimalJsLike | number | string
    lng?: DecimalWithAggregatesFilter<"LocationLog"> | Decimal | DecimalJsLike | number | string
    altitude?: DecimalNullableWithAggregatesFilter<"LocationLog"> | Decimal | DecimalJsLike | number | string | null
    speed?: DecimalNullableWithAggregatesFilter<"LocationLog"> | Decimal | DecimalJsLike | number | string | null
    heading?: DecimalNullableWithAggregatesFilter<"LocationLog"> | Decimal | DecimalJsLike | number | string | null
    batteryVoltage?: FloatNullableWithAggregatesFilter<"LocationLog"> | number | null
    ignition?: BoolWithAggregatesFilter<"LocationLog"> | boolean
    timestamp?: DateTimeWithAggregatesFilter<"LocationLog"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"LocationLog"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: UuidFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumuserRoleFilter<"User"> | $Enums.userRole
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    vehicleInfos?: VehicleInfoListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    vehicleInfos?: VehicleInfoOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumuserRoleFilter<"User"> | $Enums.userRole
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    vehicleInfos?: VehicleInfoListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    role?: EnumuserRoleWithAggregatesFilter<"User"> | $Enums.userRole
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type GeofenceWhereInput = {
    AND?: GeofenceWhereInput | GeofenceWhereInput[]
    OR?: GeofenceWhereInput[]
    NOT?: GeofenceWhereInput | GeofenceWhereInput[]
    id?: UuidFilter<"Geofence"> | string
    name?: StringFilter<"Geofence"> | string
    zoneHash?: StringNullableFilter<"Geofence"> | string | null
    isActive?: BoolFilter<"Geofence"> | boolean
    createdAt?: DateTimeFilter<"Geofence"> | Date | string
    updatedAt?: DateTimeFilter<"Geofence"> | Date | string
    vehicles?: VehiclesOnGeofencesListRelationFilter
  }

  export type GeofenceOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    zoneHash?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    vehicles?: VehiclesOnGeofencesOrderByRelationAggregateInput
  }

  export type GeofenceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    zoneHash?: string
    AND?: GeofenceWhereInput | GeofenceWhereInput[]
    OR?: GeofenceWhereInput[]
    NOT?: GeofenceWhereInput | GeofenceWhereInput[]
    name?: StringFilter<"Geofence"> | string
    isActive?: BoolFilter<"Geofence"> | boolean
    createdAt?: DateTimeFilter<"Geofence"> | Date | string
    updatedAt?: DateTimeFilter<"Geofence"> | Date | string
    vehicles?: VehiclesOnGeofencesListRelationFilter
  }, "id" | "zoneHash">

  export type GeofenceOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    zoneHash?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: GeofenceCountOrderByAggregateInput
    _max?: GeofenceMaxOrderByAggregateInput
    _min?: GeofenceMinOrderByAggregateInput
  }

  export type GeofenceScalarWhereWithAggregatesInput = {
    AND?: GeofenceScalarWhereWithAggregatesInput | GeofenceScalarWhereWithAggregatesInput[]
    OR?: GeofenceScalarWhereWithAggregatesInput[]
    NOT?: GeofenceScalarWhereWithAggregatesInput | GeofenceScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Geofence"> | string
    name?: StringWithAggregatesFilter<"Geofence"> | string
    zoneHash?: StringNullableWithAggregatesFilter<"Geofence"> | string | null
    isActive?: BoolWithAggregatesFilter<"Geofence"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Geofence"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Geofence"> | Date | string
  }

  export type VehiclesOnGeofencesWhereInput = {
    AND?: VehiclesOnGeofencesWhereInput | VehiclesOnGeofencesWhereInput[]
    OR?: VehiclesOnGeofencesWhereInput[]
    NOT?: VehiclesOnGeofencesWhereInput | VehiclesOnGeofencesWhereInput[]
    vehicleId?: UuidFilter<"VehiclesOnGeofences"> | string
    geofenceId?: UuidFilter<"VehiclesOnGeofences"> | string
    assignedAt?: DateTimeFilter<"VehiclesOnGeofences"> | Date | string
    vehicle?: XOR<VehicleInfoScalarRelationFilter, VehicleInfoWhereInput>
    geofence?: XOR<GeofenceScalarRelationFilter, GeofenceWhereInput>
  }

  export type VehiclesOnGeofencesOrderByWithRelationInput = {
    vehicleId?: SortOrder
    geofenceId?: SortOrder
    assignedAt?: SortOrder
    vehicle?: VehicleInfoOrderByWithRelationInput
    geofence?: GeofenceOrderByWithRelationInput
  }

  export type VehiclesOnGeofencesWhereUniqueInput = Prisma.AtLeast<{
    vehicleId_geofenceId?: VehiclesOnGeofencesVehicleIdGeofenceIdCompoundUniqueInput
    AND?: VehiclesOnGeofencesWhereInput | VehiclesOnGeofencesWhereInput[]
    OR?: VehiclesOnGeofencesWhereInput[]
    NOT?: VehiclesOnGeofencesWhereInput | VehiclesOnGeofencesWhereInput[]
    vehicleId?: UuidFilter<"VehiclesOnGeofences"> | string
    geofenceId?: UuidFilter<"VehiclesOnGeofences"> | string
    assignedAt?: DateTimeFilter<"VehiclesOnGeofences"> | Date | string
    vehicle?: XOR<VehicleInfoScalarRelationFilter, VehicleInfoWhereInput>
    geofence?: XOR<GeofenceScalarRelationFilter, GeofenceWhereInput>
  }, "vehicleId_geofenceId">

  export type VehiclesOnGeofencesOrderByWithAggregationInput = {
    vehicleId?: SortOrder
    geofenceId?: SortOrder
    assignedAt?: SortOrder
    _count?: VehiclesOnGeofencesCountOrderByAggregateInput
    _max?: VehiclesOnGeofencesMaxOrderByAggregateInput
    _min?: VehiclesOnGeofencesMinOrderByAggregateInput
  }

  export type VehiclesOnGeofencesScalarWhereWithAggregatesInput = {
    AND?: VehiclesOnGeofencesScalarWhereWithAggregatesInput | VehiclesOnGeofencesScalarWhereWithAggregatesInput[]
    OR?: VehiclesOnGeofencesScalarWhereWithAggregatesInput[]
    NOT?: VehiclesOnGeofencesScalarWhereWithAggregatesInput | VehiclesOnGeofencesScalarWhereWithAggregatesInput[]
    vehicleId?: UuidWithAggregatesFilter<"VehiclesOnGeofences"> | string
    geofenceId?: UuidWithAggregatesFilter<"VehiclesOnGeofences"> | string
    assignedAt?: DateTimeWithAggregatesFilter<"VehiclesOnGeofences"> | Date | string
  }

  export type VehicleComplianceWhereInput = {
    AND?: VehicleComplianceWhereInput | VehicleComplianceWhereInput[]
    OR?: VehicleComplianceWhereInput[]
    NOT?: VehicleComplianceWhereInput | VehicleComplianceWhereInput[]
    id?: UuidFilter<"VehicleCompliance"> | string
    vehicleId?: UuidFilter<"VehicleCompliance"> | string
    fuelQuantity?: DecimalFilter<"VehicleCompliance"> | Decimal | DecimalJsLike | number | string
    fuelRate?: DecimalFilter<"VehicleCompliance"> | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFilter<"VehicleCompliance"> | Decimal | DecimalJsLike | number | string
    filledLat?: DecimalNullableFilter<"VehicleCompliance"> | Decimal | DecimalJsLike | number | string | null
    filledLng?: DecimalNullableFilter<"VehicleCompliance"> | Decimal | DecimalJsLike | number | string | null
    filledAddress?: StringNullableFilter<"VehicleCompliance"> | string | null
    filledBy?: StringFilter<"VehicleCompliance"> | string
    receiptUrl?: StringNullableFilter<"VehicleCompliance"> | string | null
    filledAt?: DateTimeFilter<"VehicleCompliance"> | Date | string
    createdAt?: DateTimeFilter<"VehicleCompliance"> | Date | string
    vehicle?: XOR<VehicleInfoScalarRelationFilter, VehicleInfoWhereInput>
  }

  export type VehicleComplianceOrderByWithRelationInput = {
    id?: SortOrder
    vehicleId?: SortOrder
    fuelQuantity?: SortOrder
    fuelRate?: SortOrder
    totalCost?: SortOrder
    filledLat?: SortOrderInput | SortOrder
    filledLng?: SortOrderInput | SortOrder
    filledAddress?: SortOrderInput | SortOrder
    filledBy?: SortOrder
    receiptUrl?: SortOrderInput | SortOrder
    filledAt?: SortOrder
    createdAt?: SortOrder
    vehicle?: VehicleInfoOrderByWithRelationInput
  }

  export type VehicleComplianceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VehicleComplianceWhereInput | VehicleComplianceWhereInput[]
    OR?: VehicleComplianceWhereInput[]
    NOT?: VehicleComplianceWhereInput | VehicleComplianceWhereInput[]
    vehicleId?: UuidFilter<"VehicleCompliance"> | string
    fuelQuantity?: DecimalFilter<"VehicleCompliance"> | Decimal | DecimalJsLike | number | string
    fuelRate?: DecimalFilter<"VehicleCompliance"> | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFilter<"VehicleCompliance"> | Decimal | DecimalJsLike | number | string
    filledLat?: DecimalNullableFilter<"VehicleCompliance"> | Decimal | DecimalJsLike | number | string | null
    filledLng?: DecimalNullableFilter<"VehicleCompliance"> | Decimal | DecimalJsLike | number | string | null
    filledAddress?: StringNullableFilter<"VehicleCompliance"> | string | null
    filledBy?: StringFilter<"VehicleCompliance"> | string
    receiptUrl?: StringNullableFilter<"VehicleCompliance"> | string | null
    filledAt?: DateTimeFilter<"VehicleCompliance"> | Date | string
    createdAt?: DateTimeFilter<"VehicleCompliance"> | Date | string
    vehicle?: XOR<VehicleInfoScalarRelationFilter, VehicleInfoWhereInput>
  }, "id">

  export type VehicleComplianceOrderByWithAggregationInput = {
    id?: SortOrder
    vehicleId?: SortOrder
    fuelQuantity?: SortOrder
    fuelRate?: SortOrder
    totalCost?: SortOrder
    filledLat?: SortOrderInput | SortOrder
    filledLng?: SortOrderInput | SortOrder
    filledAddress?: SortOrderInput | SortOrder
    filledBy?: SortOrder
    receiptUrl?: SortOrderInput | SortOrder
    filledAt?: SortOrder
    createdAt?: SortOrder
    _count?: VehicleComplianceCountOrderByAggregateInput
    _avg?: VehicleComplianceAvgOrderByAggregateInput
    _max?: VehicleComplianceMaxOrderByAggregateInput
    _min?: VehicleComplianceMinOrderByAggregateInput
    _sum?: VehicleComplianceSumOrderByAggregateInput
  }

  export type VehicleComplianceScalarWhereWithAggregatesInput = {
    AND?: VehicleComplianceScalarWhereWithAggregatesInput | VehicleComplianceScalarWhereWithAggregatesInput[]
    OR?: VehicleComplianceScalarWhereWithAggregatesInput[]
    NOT?: VehicleComplianceScalarWhereWithAggregatesInput | VehicleComplianceScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"VehicleCompliance"> | string
    vehicleId?: UuidWithAggregatesFilter<"VehicleCompliance"> | string
    fuelQuantity?: DecimalWithAggregatesFilter<"VehicleCompliance"> | Decimal | DecimalJsLike | number | string
    fuelRate?: DecimalWithAggregatesFilter<"VehicleCompliance"> | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalWithAggregatesFilter<"VehicleCompliance"> | Decimal | DecimalJsLike | number | string
    filledLat?: DecimalNullableWithAggregatesFilter<"VehicleCompliance"> | Decimal | DecimalJsLike | number | string | null
    filledLng?: DecimalNullableWithAggregatesFilter<"VehicleCompliance"> | Decimal | DecimalJsLike | number | string | null
    filledAddress?: StringNullableWithAggregatesFilter<"VehicleCompliance"> | string | null
    filledBy?: StringWithAggregatesFilter<"VehicleCompliance"> | string
    receiptUrl?: StringNullableWithAggregatesFilter<"VehicleCompliance"> | string | null
    filledAt?: DateTimeWithAggregatesFilter<"VehicleCompliance"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"VehicleCompliance"> | Date | string
  }

  export type VehicleInfoCreateInput = {
    id?: string
    imei: string
    vechicleNumb: string
    createdAt?: Date | string
    updatedAt?: Date | string
    customer: UserCreateNestedOneWithoutVehicleInfosInput
    locations?: LocationLogCreateNestedManyWithoutVehicleInput
    compliances?: VehicleComplianceCreateNestedManyWithoutVehicleInput
    geofences?: VehiclesOnGeofencesCreateNestedManyWithoutVehicleInput
  }

  export type VehicleInfoUncheckedCreateInput = {
    id?: string
    imei: string
    vechicleNumb: string
    customerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    locations?: LocationLogUncheckedCreateNestedManyWithoutVehicleInput
    compliances?: VehicleComplianceUncheckedCreateNestedManyWithoutVehicleInput
    geofences?: VehiclesOnGeofencesUncheckedCreateNestedManyWithoutVehicleInput
  }

  export type VehicleInfoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    imei?: StringFieldUpdateOperationsInput | string
    vechicleNumb?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: UserUpdateOneRequiredWithoutVehicleInfosNestedInput
    locations?: LocationLogUpdateManyWithoutVehicleNestedInput
    compliances?: VehicleComplianceUpdateManyWithoutVehicleNestedInput
    geofences?: VehiclesOnGeofencesUpdateManyWithoutVehicleNestedInput
  }

  export type VehicleInfoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    imei?: StringFieldUpdateOperationsInput | string
    vechicleNumb?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: LocationLogUncheckedUpdateManyWithoutVehicleNestedInput
    compliances?: VehicleComplianceUncheckedUpdateManyWithoutVehicleNestedInput
    geofences?: VehiclesOnGeofencesUncheckedUpdateManyWithoutVehicleNestedInput
  }

  export type VehicleInfoCreateManyInput = {
    id?: string
    imei: string
    vechicleNumb: string
    customerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VehicleInfoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    imei?: StringFieldUpdateOperationsInput | string
    vechicleNumb?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VehicleInfoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    imei?: StringFieldUpdateOperationsInput | string
    vechicleNumb?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocationLogCreateInput = {
    id?: string
    lat: Decimal | DecimalJsLike | number | string
    lng: Decimal | DecimalJsLike | number | string
    altitude?: Decimal | DecimalJsLike | number | string | null
    speed?: Decimal | DecimalJsLike | number | string | null
    heading?: Decimal | DecimalJsLike | number | string | null
    batteryVoltage?: number | null
    ignition?: boolean
    timestamp: Date | string
    createdAt?: Date | string
    vehicle: VehicleInfoCreateNestedOneWithoutLocationsInput
  }

  export type LocationLogUncheckedCreateInput = {
    id?: string
    imei: string
    lat: Decimal | DecimalJsLike | number | string
    lng: Decimal | DecimalJsLike | number | string
    altitude?: Decimal | DecimalJsLike | number | string | null
    speed?: Decimal | DecimalJsLike | number | string | null
    heading?: Decimal | DecimalJsLike | number | string | null
    batteryVoltage?: number | null
    ignition?: boolean
    timestamp: Date | string
    createdAt?: Date | string
  }

  export type LocationLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    lat?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lng?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    altitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    speed?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    heading?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    batteryVoltage?: NullableFloatFieldUpdateOperationsInput | number | null
    ignition?: BoolFieldUpdateOperationsInput | boolean
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicle?: VehicleInfoUpdateOneRequiredWithoutLocationsNestedInput
  }

  export type LocationLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    imei?: StringFieldUpdateOperationsInput | string
    lat?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lng?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    altitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    speed?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    heading?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    batteryVoltage?: NullableFloatFieldUpdateOperationsInput | number | null
    ignition?: BoolFieldUpdateOperationsInput | boolean
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocationLogCreateManyInput = {
    id?: string
    imei: string
    lat: Decimal | DecimalJsLike | number | string
    lng: Decimal | DecimalJsLike | number | string
    altitude?: Decimal | DecimalJsLike | number | string | null
    speed?: Decimal | DecimalJsLike | number | string | null
    heading?: Decimal | DecimalJsLike | number | string | null
    batteryVoltage?: number | null
    ignition?: boolean
    timestamp: Date | string
    createdAt?: Date | string
  }

  export type LocationLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    lat?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lng?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    altitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    speed?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    heading?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    batteryVoltage?: NullableFloatFieldUpdateOperationsInput | number | null
    ignition?: BoolFieldUpdateOperationsInput | boolean
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocationLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    imei?: StringFieldUpdateOperationsInput | string
    lat?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lng?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    altitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    speed?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    heading?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    batteryVoltage?: NullableFloatFieldUpdateOperationsInput | number | null
    ignition?: BoolFieldUpdateOperationsInput | boolean
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.userRole
    createdAt?: Date | string
    updatedAt?: Date | string
    vehicleInfos?: VehicleInfoCreateNestedManyWithoutCustomerInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.userRole
    createdAt?: Date | string
    updatedAt?: Date | string
    vehicleInfos?: VehicleInfoUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumuserRoleFieldUpdateOperationsInput | $Enums.userRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicleInfos?: VehicleInfoUpdateManyWithoutCustomerNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumuserRoleFieldUpdateOperationsInput | $Enums.userRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicleInfos?: VehicleInfoUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.userRole
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumuserRoleFieldUpdateOperationsInput | $Enums.userRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumuserRoleFieldUpdateOperationsInput | $Enums.userRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GeofenceCreateInput = {
    id?: string
    name: string
    zoneHash?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    vehicles?: VehiclesOnGeofencesCreateNestedManyWithoutGeofenceInput
  }

  export type GeofenceUncheckedCreateInput = {
    id?: string
    name: string
    zoneHash?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    vehicles?: VehiclesOnGeofencesUncheckedCreateNestedManyWithoutGeofenceInput
  }

  export type GeofenceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    zoneHash?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicles?: VehiclesOnGeofencesUpdateManyWithoutGeofenceNestedInput
  }

  export type GeofenceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    zoneHash?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicles?: VehiclesOnGeofencesUncheckedUpdateManyWithoutGeofenceNestedInput
  }

  export type GeofenceCreateManyInput = {
    id?: string
    name: string
    zoneHash?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GeofenceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    zoneHash?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GeofenceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    zoneHash?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VehiclesOnGeofencesCreateInput = {
    assignedAt?: Date | string
    vehicle: VehicleInfoCreateNestedOneWithoutGeofencesInput
    geofence: GeofenceCreateNestedOneWithoutVehiclesInput
  }

  export type VehiclesOnGeofencesUncheckedCreateInput = {
    vehicleId: string
    geofenceId: string
    assignedAt?: Date | string
  }

  export type VehiclesOnGeofencesUpdateInput = {
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicle?: VehicleInfoUpdateOneRequiredWithoutGeofencesNestedInput
    geofence?: GeofenceUpdateOneRequiredWithoutVehiclesNestedInput
  }

  export type VehiclesOnGeofencesUncheckedUpdateInput = {
    vehicleId?: StringFieldUpdateOperationsInput | string
    geofenceId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VehiclesOnGeofencesCreateManyInput = {
    vehicleId: string
    geofenceId: string
    assignedAt?: Date | string
  }

  export type VehiclesOnGeofencesUpdateManyMutationInput = {
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VehiclesOnGeofencesUncheckedUpdateManyInput = {
    vehicleId?: StringFieldUpdateOperationsInput | string
    geofenceId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VehicleComplianceCreateInput = {
    id?: string
    fuelQuantity: Decimal | DecimalJsLike | number | string
    fuelRate: Decimal | DecimalJsLike | number | string
    totalCost: Decimal | DecimalJsLike | number | string
    filledLat?: Decimal | DecimalJsLike | number | string | null
    filledLng?: Decimal | DecimalJsLike | number | string | null
    filledAddress?: string | null
    filledBy: string
    receiptUrl?: string | null
    filledAt: Date | string
    createdAt?: Date | string
    vehicle: VehicleInfoCreateNestedOneWithoutCompliancesInput
  }

  export type VehicleComplianceUncheckedCreateInput = {
    id?: string
    vehicleId: string
    fuelQuantity: Decimal | DecimalJsLike | number | string
    fuelRate: Decimal | DecimalJsLike | number | string
    totalCost: Decimal | DecimalJsLike | number | string
    filledLat?: Decimal | DecimalJsLike | number | string | null
    filledLng?: Decimal | DecimalJsLike | number | string | null
    filledAddress?: string | null
    filledBy: string
    receiptUrl?: string | null
    filledAt: Date | string
    createdAt?: Date | string
  }

  export type VehicleComplianceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fuelQuantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fuelRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    filledLat?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    filledLng?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    filledAddress?: NullableStringFieldUpdateOperationsInput | string | null
    filledBy?: StringFieldUpdateOperationsInput | string
    receiptUrl?: NullableStringFieldUpdateOperationsInput | string | null
    filledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicle?: VehicleInfoUpdateOneRequiredWithoutCompliancesNestedInput
  }

  export type VehicleComplianceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicleId?: StringFieldUpdateOperationsInput | string
    fuelQuantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fuelRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    filledLat?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    filledLng?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    filledAddress?: NullableStringFieldUpdateOperationsInput | string | null
    filledBy?: StringFieldUpdateOperationsInput | string
    receiptUrl?: NullableStringFieldUpdateOperationsInput | string | null
    filledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VehicleComplianceCreateManyInput = {
    id?: string
    vehicleId: string
    fuelQuantity: Decimal | DecimalJsLike | number | string
    fuelRate: Decimal | DecimalJsLike | number | string
    totalCost: Decimal | DecimalJsLike | number | string
    filledLat?: Decimal | DecimalJsLike | number | string | null
    filledLng?: Decimal | DecimalJsLike | number | string | null
    filledAddress?: string | null
    filledBy: string
    receiptUrl?: string | null
    filledAt: Date | string
    createdAt?: Date | string
  }

  export type VehicleComplianceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fuelQuantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fuelRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    filledLat?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    filledLng?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    filledAddress?: NullableStringFieldUpdateOperationsInput | string | null
    filledBy?: StringFieldUpdateOperationsInput | string
    receiptUrl?: NullableStringFieldUpdateOperationsInput | string | null
    filledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VehicleComplianceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicleId?: StringFieldUpdateOperationsInput | string
    fuelQuantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fuelRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    filledLat?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    filledLng?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    filledAddress?: NullableStringFieldUpdateOperationsInput | string | null
    filledBy?: StringFieldUpdateOperationsInput | string
    receiptUrl?: NullableStringFieldUpdateOperationsInput | string | null
    filledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type LocationLogListRelationFilter = {
    every?: LocationLogWhereInput
    some?: LocationLogWhereInput
    none?: LocationLogWhereInput
  }

  export type VehicleComplianceListRelationFilter = {
    every?: VehicleComplianceWhereInput
    some?: VehicleComplianceWhereInput
    none?: VehicleComplianceWhereInput
  }

  export type VehiclesOnGeofencesListRelationFilter = {
    every?: VehiclesOnGeofencesWhereInput
    some?: VehiclesOnGeofencesWhereInput
    none?: VehiclesOnGeofencesWhereInput
  }

  export type LocationLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VehicleComplianceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VehiclesOnGeofencesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VehicleInfoCountOrderByAggregateInput = {
    id?: SortOrder
    imei?: SortOrder
    vechicleNumb?: SortOrder
    customerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VehicleInfoMaxOrderByAggregateInput = {
    id?: SortOrder
    imei?: SortOrder
    vechicleNumb?: SortOrder
    customerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VehicleInfoMinOrderByAggregateInput = {
    id?: SortOrder
    imei?: SortOrder
    vechicleNumb?: SortOrder
    customerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type VehicleInfoScalarRelationFilter = {
    is?: VehicleInfoWhereInput
    isNot?: VehicleInfoWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type LocationLogCountOrderByAggregateInput = {
    id?: SortOrder
    imei?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    altitude?: SortOrder
    speed?: SortOrder
    heading?: SortOrder
    batteryVoltage?: SortOrder
    ignition?: SortOrder
    timestamp?: SortOrder
    createdAt?: SortOrder
  }

  export type LocationLogAvgOrderByAggregateInput = {
    lat?: SortOrder
    lng?: SortOrder
    altitude?: SortOrder
    speed?: SortOrder
    heading?: SortOrder
    batteryVoltage?: SortOrder
  }

  export type LocationLogMaxOrderByAggregateInput = {
    id?: SortOrder
    imei?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    altitude?: SortOrder
    speed?: SortOrder
    heading?: SortOrder
    batteryVoltage?: SortOrder
    ignition?: SortOrder
    timestamp?: SortOrder
    createdAt?: SortOrder
  }

  export type LocationLogMinOrderByAggregateInput = {
    id?: SortOrder
    imei?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    altitude?: SortOrder
    speed?: SortOrder
    heading?: SortOrder
    batteryVoltage?: SortOrder
    ignition?: SortOrder
    timestamp?: SortOrder
    createdAt?: SortOrder
  }

  export type LocationLogSumOrderByAggregateInput = {
    lat?: SortOrder
    lng?: SortOrder
    altitude?: SortOrder
    speed?: SortOrder
    heading?: SortOrder
    batteryVoltage?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumuserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.userRole | EnumuserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.userRole[] | ListEnumuserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.userRole[] | ListEnumuserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumuserRoleFilter<$PrismaModel> | $Enums.userRole
  }

  export type VehicleInfoListRelationFilter = {
    every?: VehicleInfoWhereInput
    some?: VehicleInfoWhereInput
    none?: VehicleInfoWhereInput
  }

  export type VehicleInfoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumuserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.userRole | EnumuserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.userRole[] | ListEnumuserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.userRole[] | ListEnumuserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumuserRoleWithAggregatesFilter<$PrismaModel> | $Enums.userRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumuserRoleFilter<$PrismaModel>
    _max?: NestedEnumuserRoleFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type GeofenceCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    zoneHash?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GeofenceMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    zoneHash?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GeofenceMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    zoneHash?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type GeofenceScalarRelationFilter = {
    is?: GeofenceWhereInput
    isNot?: GeofenceWhereInput
  }

  export type VehiclesOnGeofencesVehicleIdGeofenceIdCompoundUniqueInput = {
    vehicleId: string
    geofenceId: string
  }

  export type VehiclesOnGeofencesCountOrderByAggregateInput = {
    vehicleId?: SortOrder
    geofenceId?: SortOrder
    assignedAt?: SortOrder
  }

  export type VehiclesOnGeofencesMaxOrderByAggregateInput = {
    vehicleId?: SortOrder
    geofenceId?: SortOrder
    assignedAt?: SortOrder
  }

  export type VehiclesOnGeofencesMinOrderByAggregateInput = {
    vehicleId?: SortOrder
    geofenceId?: SortOrder
    assignedAt?: SortOrder
  }

  export type VehicleComplianceCountOrderByAggregateInput = {
    id?: SortOrder
    vehicleId?: SortOrder
    fuelQuantity?: SortOrder
    fuelRate?: SortOrder
    totalCost?: SortOrder
    filledLat?: SortOrder
    filledLng?: SortOrder
    filledAddress?: SortOrder
    filledBy?: SortOrder
    receiptUrl?: SortOrder
    filledAt?: SortOrder
    createdAt?: SortOrder
  }

  export type VehicleComplianceAvgOrderByAggregateInput = {
    fuelQuantity?: SortOrder
    fuelRate?: SortOrder
    totalCost?: SortOrder
    filledLat?: SortOrder
    filledLng?: SortOrder
  }

  export type VehicleComplianceMaxOrderByAggregateInput = {
    id?: SortOrder
    vehicleId?: SortOrder
    fuelQuantity?: SortOrder
    fuelRate?: SortOrder
    totalCost?: SortOrder
    filledLat?: SortOrder
    filledLng?: SortOrder
    filledAddress?: SortOrder
    filledBy?: SortOrder
    receiptUrl?: SortOrder
    filledAt?: SortOrder
    createdAt?: SortOrder
  }

  export type VehicleComplianceMinOrderByAggregateInput = {
    id?: SortOrder
    vehicleId?: SortOrder
    fuelQuantity?: SortOrder
    fuelRate?: SortOrder
    totalCost?: SortOrder
    filledLat?: SortOrder
    filledLng?: SortOrder
    filledAddress?: SortOrder
    filledBy?: SortOrder
    receiptUrl?: SortOrder
    filledAt?: SortOrder
    createdAt?: SortOrder
  }

  export type VehicleComplianceSumOrderByAggregateInput = {
    fuelQuantity?: SortOrder
    fuelRate?: SortOrder
    totalCost?: SortOrder
    filledLat?: SortOrder
    filledLng?: SortOrder
  }

  export type UserCreateNestedOneWithoutVehicleInfosInput = {
    create?: XOR<UserCreateWithoutVehicleInfosInput, UserUncheckedCreateWithoutVehicleInfosInput>
    connectOrCreate?: UserCreateOrConnectWithoutVehicleInfosInput
    connect?: UserWhereUniqueInput
  }

  export type LocationLogCreateNestedManyWithoutVehicleInput = {
    create?: XOR<LocationLogCreateWithoutVehicleInput, LocationLogUncheckedCreateWithoutVehicleInput> | LocationLogCreateWithoutVehicleInput[] | LocationLogUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: LocationLogCreateOrConnectWithoutVehicleInput | LocationLogCreateOrConnectWithoutVehicleInput[]
    createMany?: LocationLogCreateManyVehicleInputEnvelope
    connect?: LocationLogWhereUniqueInput | LocationLogWhereUniqueInput[]
  }

  export type VehicleComplianceCreateNestedManyWithoutVehicleInput = {
    create?: XOR<VehicleComplianceCreateWithoutVehicleInput, VehicleComplianceUncheckedCreateWithoutVehicleInput> | VehicleComplianceCreateWithoutVehicleInput[] | VehicleComplianceUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: VehicleComplianceCreateOrConnectWithoutVehicleInput | VehicleComplianceCreateOrConnectWithoutVehicleInput[]
    createMany?: VehicleComplianceCreateManyVehicleInputEnvelope
    connect?: VehicleComplianceWhereUniqueInput | VehicleComplianceWhereUniqueInput[]
  }

  export type VehiclesOnGeofencesCreateNestedManyWithoutVehicleInput = {
    create?: XOR<VehiclesOnGeofencesCreateWithoutVehicleInput, VehiclesOnGeofencesUncheckedCreateWithoutVehicleInput> | VehiclesOnGeofencesCreateWithoutVehicleInput[] | VehiclesOnGeofencesUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: VehiclesOnGeofencesCreateOrConnectWithoutVehicleInput | VehiclesOnGeofencesCreateOrConnectWithoutVehicleInput[]
    createMany?: VehiclesOnGeofencesCreateManyVehicleInputEnvelope
    connect?: VehiclesOnGeofencesWhereUniqueInput | VehiclesOnGeofencesWhereUniqueInput[]
  }

  export type LocationLogUncheckedCreateNestedManyWithoutVehicleInput = {
    create?: XOR<LocationLogCreateWithoutVehicleInput, LocationLogUncheckedCreateWithoutVehicleInput> | LocationLogCreateWithoutVehicleInput[] | LocationLogUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: LocationLogCreateOrConnectWithoutVehicleInput | LocationLogCreateOrConnectWithoutVehicleInput[]
    createMany?: LocationLogCreateManyVehicleInputEnvelope
    connect?: LocationLogWhereUniqueInput | LocationLogWhereUniqueInput[]
  }

  export type VehicleComplianceUncheckedCreateNestedManyWithoutVehicleInput = {
    create?: XOR<VehicleComplianceCreateWithoutVehicleInput, VehicleComplianceUncheckedCreateWithoutVehicleInput> | VehicleComplianceCreateWithoutVehicleInput[] | VehicleComplianceUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: VehicleComplianceCreateOrConnectWithoutVehicleInput | VehicleComplianceCreateOrConnectWithoutVehicleInput[]
    createMany?: VehicleComplianceCreateManyVehicleInputEnvelope
    connect?: VehicleComplianceWhereUniqueInput | VehicleComplianceWhereUniqueInput[]
  }

  export type VehiclesOnGeofencesUncheckedCreateNestedManyWithoutVehicleInput = {
    create?: XOR<VehiclesOnGeofencesCreateWithoutVehicleInput, VehiclesOnGeofencesUncheckedCreateWithoutVehicleInput> | VehiclesOnGeofencesCreateWithoutVehicleInput[] | VehiclesOnGeofencesUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: VehiclesOnGeofencesCreateOrConnectWithoutVehicleInput | VehiclesOnGeofencesCreateOrConnectWithoutVehicleInput[]
    createMany?: VehiclesOnGeofencesCreateManyVehicleInputEnvelope
    connect?: VehiclesOnGeofencesWhereUniqueInput | VehiclesOnGeofencesWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserUpdateOneRequiredWithoutVehicleInfosNestedInput = {
    create?: XOR<UserCreateWithoutVehicleInfosInput, UserUncheckedCreateWithoutVehicleInfosInput>
    connectOrCreate?: UserCreateOrConnectWithoutVehicleInfosInput
    upsert?: UserUpsertWithoutVehicleInfosInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutVehicleInfosInput, UserUpdateWithoutVehicleInfosInput>, UserUncheckedUpdateWithoutVehicleInfosInput>
  }

  export type LocationLogUpdateManyWithoutVehicleNestedInput = {
    create?: XOR<LocationLogCreateWithoutVehicleInput, LocationLogUncheckedCreateWithoutVehicleInput> | LocationLogCreateWithoutVehicleInput[] | LocationLogUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: LocationLogCreateOrConnectWithoutVehicleInput | LocationLogCreateOrConnectWithoutVehicleInput[]
    upsert?: LocationLogUpsertWithWhereUniqueWithoutVehicleInput | LocationLogUpsertWithWhereUniqueWithoutVehicleInput[]
    createMany?: LocationLogCreateManyVehicleInputEnvelope
    set?: LocationLogWhereUniqueInput | LocationLogWhereUniqueInput[]
    disconnect?: LocationLogWhereUniqueInput | LocationLogWhereUniqueInput[]
    delete?: LocationLogWhereUniqueInput | LocationLogWhereUniqueInput[]
    connect?: LocationLogWhereUniqueInput | LocationLogWhereUniqueInput[]
    update?: LocationLogUpdateWithWhereUniqueWithoutVehicleInput | LocationLogUpdateWithWhereUniqueWithoutVehicleInput[]
    updateMany?: LocationLogUpdateManyWithWhereWithoutVehicleInput | LocationLogUpdateManyWithWhereWithoutVehicleInput[]
    deleteMany?: LocationLogScalarWhereInput | LocationLogScalarWhereInput[]
  }

  export type VehicleComplianceUpdateManyWithoutVehicleNestedInput = {
    create?: XOR<VehicleComplianceCreateWithoutVehicleInput, VehicleComplianceUncheckedCreateWithoutVehicleInput> | VehicleComplianceCreateWithoutVehicleInput[] | VehicleComplianceUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: VehicleComplianceCreateOrConnectWithoutVehicleInput | VehicleComplianceCreateOrConnectWithoutVehicleInput[]
    upsert?: VehicleComplianceUpsertWithWhereUniqueWithoutVehicleInput | VehicleComplianceUpsertWithWhereUniqueWithoutVehicleInput[]
    createMany?: VehicleComplianceCreateManyVehicleInputEnvelope
    set?: VehicleComplianceWhereUniqueInput | VehicleComplianceWhereUniqueInput[]
    disconnect?: VehicleComplianceWhereUniqueInput | VehicleComplianceWhereUniqueInput[]
    delete?: VehicleComplianceWhereUniqueInput | VehicleComplianceWhereUniqueInput[]
    connect?: VehicleComplianceWhereUniqueInput | VehicleComplianceWhereUniqueInput[]
    update?: VehicleComplianceUpdateWithWhereUniqueWithoutVehicleInput | VehicleComplianceUpdateWithWhereUniqueWithoutVehicleInput[]
    updateMany?: VehicleComplianceUpdateManyWithWhereWithoutVehicleInput | VehicleComplianceUpdateManyWithWhereWithoutVehicleInput[]
    deleteMany?: VehicleComplianceScalarWhereInput | VehicleComplianceScalarWhereInput[]
  }

  export type VehiclesOnGeofencesUpdateManyWithoutVehicleNestedInput = {
    create?: XOR<VehiclesOnGeofencesCreateWithoutVehicleInput, VehiclesOnGeofencesUncheckedCreateWithoutVehicleInput> | VehiclesOnGeofencesCreateWithoutVehicleInput[] | VehiclesOnGeofencesUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: VehiclesOnGeofencesCreateOrConnectWithoutVehicleInput | VehiclesOnGeofencesCreateOrConnectWithoutVehicleInput[]
    upsert?: VehiclesOnGeofencesUpsertWithWhereUniqueWithoutVehicleInput | VehiclesOnGeofencesUpsertWithWhereUniqueWithoutVehicleInput[]
    createMany?: VehiclesOnGeofencesCreateManyVehicleInputEnvelope
    set?: VehiclesOnGeofencesWhereUniqueInput | VehiclesOnGeofencesWhereUniqueInput[]
    disconnect?: VehiclesOnGeofencesWhereUniqueInput | VehiclesOnGeofencesWhereUniqueInput[]
    delete?: VehiclesOnGeofencesWhereUniqueInput | VehiclesOnGeofencesWhereUniqueInput[]
    connect?: VehiclesOnGeofencesWhereUniqueInput | VehiclesOnGeofencesWhereUniqueInput[]
    update?: VehiclesOnGeofencesUpdateWithWhereUniqueWithoutVehicleInput | VehiclesOnGeofencesUpdateWithWhereUniqueWithoutVehicleInput[]
    updateMany?: VehiclesOnGeofencesUpdateManyWithWhereWithoutVehicleInput | VehiclesOnGeofencesUpdateManyWithWhereWithoutVehicleInput[]
    deleteMany?: VehiclesOnGeofencesScalarWhereInput | VehiclesOnGeofencesScalarWhereInput[]
  }

  export type LocationLogUncheckedUpdateManyWithoutVehicleNestedInput = {
    create?: XOR<LocationLogCreateWithoutVehicleInput, LocationLogUncheckedCreateWithoutVehicleInput> | LocationLogCreateWithoutVehicleInput[] | LocationLogUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: LocationLogCreateOrConnectWithoutVehicleInput | LocationLogCreateOrConnectWithoutVehicleInput[]
    upsert?: LocationLogUpsertWithWhereUniqueWithoutVehicleInput | LocationLogUpsertWithWhereUniqueWithoutVehicleInput[]
    createMany?: LocationLogCreateManyVehicleInputEnvelope
    set?: LocationLogWhereUniqueInput | LocationLogWhereUniqueInput[]
    disconnect?: LocationLogWhereUniqueInput | LocationLogWhereUniqueInput[]
    delete?: LocationLogWhereUniqueInput | LocationLogWhereUniqueInput[]
    connect?: LocationLogWhereUniqueInput | LocationLogWhereUniqueInput[]
    update?: LocationLogUpdateWithWhereUniqueWithoutVehicleInput | LocationLogUpdateWithWhereUniqueWithoutVehicleInput[]
    updateMany?: LocationLogUpdateManyWithWhereWithoutVehicleInput | LocationLogUpdateManyWithWhereWithoutVehicleInput[]
    deleteMany?: LocationLogScalarWhereInput | LocationLogScalarWhereInput[]
  }

  export type VehicleComplianceUncheckedUpdateManyWithoutVehicleNestedInput = {
    create?: XOR<VehicleComplianceCreateWithoutVehicleInput, VehicleComplianceUncheckedCreateWithoutVehicleInput> | VehicleComplianceCreateWithoutVehicleInput[] | VehicleComplianceUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: VehicleComplianceCreateOrConnectWithoutVehicleInput | VehicleComplianceCreateOrConnectWithoutVehicleInput[]
    upsert?: VehicleComplianceUpsertWithWhereUniqueWithoutVehicleInput | VehicleComplianceUpsertWithWhereUniqueWithoutVehicleInput[]
    createMany?: VehicleComplianceCreateManyVehicleInputEnvelope
    set?: VehicleComplianceWhereUniqueInput | VehicleComplianceWhereUniqueInput[]
    disconnect?: VehicleComplianceWhereUniqueInput | VehicleComplianceWhereUniqueInput[]
    delete?: VehicleComplianceWhereUniqueInput | VehicleComplianceWhereUniqueInput[]
    connect?: VehicleComplianceWhereUniqueInput | VehicleComplianceWhereUniqueInput[]
    update?: VehicleComplianceUpdateWithWhereUniqueWithoutVehicleInput | VehicleComplianceUpdateWithWhereUniqueWithoutVehicleInput[]
    updateMany?: VehicleComplianceUpdateManyWithWhereWithoutVehicleInput | VehicleComplianceUpdateManyWithWhereWithoutVehicleInput[]
    deleteMany?: VehicleComplianceScalarWhereInput | VehicleComplianceScalarWhereInput[]
  }

  export type VehiclesOnGeofencesUncheckedUpdateManyWithoutVehicleNestedInput = {
    create?: XOR<VehiclesOnGeofencesCreateWithoutVehicleInput, VehiclesOnGeofencesUncheckedCreateWithoutVehicleInput> | VehiclesOnGeofencesCreateWithoutVehicleInput[] | VehiclesOnGeofencesUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: VehiclesOnGeofencesCreateOrConnectWithoutVehicleInput | VehiclesOnGeofencesCreateOrConnectWithoutVehicleInput[]
    upsert?: VehiclesOnGeofencesUpsertWithWhereUniqueWithoutVehicleInput | VehiclesOnGeofencesUpsertWithWhereUniqueWithoutVehicleInput[]
    createMany?: VehiclesOnGeofencesCreateManyVehicleInputEnvelope
    set?: VehiclesOnGeofencesWhereUniqueInput | VehiclesOnGeofencesWhereUniqueInput[]
    disconnect?: VehiclesOnGeofencesWhereUniqueInput | VehiclesOnGeofencesWhereUniqueInput[]
    delete?: VehiclesOnGeofencesWhereUniqueInput | VehiclesOnGeofencesWhereUniqueInput[]
    connect?: VehiclesOnGeofencesWhereUniqueInput | VehiclesOnGeofencesWhereUniqueInput[]
    update?: VehiclesOnGeofencesUpdateWithWhereUniqueWithoutVehicleInput | VehiclesOnGeofencesUpdateWithWhereUniqueWithoutVehicleInput[]
    updateMany?: VehiclesOnGeofencesUpdateManyWithWhereWithoutVehicleInput | VehiclesOnGeofencesUpdateManyWithWhereWithoutVehicleInput[]
    deleteMany?: VehiclesOnGeofencesScalarWhereInput | VehiclesOnGeofencesScalarWhereInput[]
  }

  export type VehicleInfoCreateNestedOneWithoutLocationsInput = {
    create?: XOR<VehicleInfoCreateWithoutLocationsInput, VehicleInfoUncheckedCreateWithoutLocationsInput>
    connectOrCreate?: VehicleInfoCreateOrConnectWithoutLocationsInput
    connect?: VehicleInfoWhereUniqueInput
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type VehicleInfoUpdateOneRequiredWithoutLocationsNestedInput = {
    create?: XOR<VehicleInfoCreateWithoutLocationsInput, VehicleInfoUncheckedCreateWithoutLocationsInput>
    connectOrCreate?: VehicleInfoCreateOrConnectWithoutLocationsInput
    upsert?: VehicleInfoUpsertWithoutLocationsInput
    connect?: VehicleInfoWhereUniqueInput
    update?: XOR<XOR<VehicleInfoUpdateToOneWithWhereWithoutLocationsInput, VehicleInfoUpdateWithoutLocationsInput>, VehicleInfoUncheckedUpdateWithoutLocationsInput>
  }

  export type VehicleInfoCreateNestedManyWithoutCustomerInput = {
    create?: XOR<VehicleInfoCreateWithoutCustomerInput, VehicleInfoUncheckedCreateWithoutCustomerInput> | VehicleInfoCreateWithoutCustomerInput[] | VehicleInfoUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: VehicleInfoCreateOrConnectWithoutCustomerInput | VehicleInfoCreateOrConnectWithoutCustomerInput[]
    createMany?: VehicleInfoCreateManyCustomerInputEnvelope
    connect?: VehicleInfoWhereUniqueInput | VehicleInfoWhereUniqueInput[]
  }

  export type VehicleInfoUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<VehicleInfoCreateWithoutCustomerInput, VehicleInfoUncheckedCreateWithoutCustomerInput> | VehicleInfoCreateWithoutCustomerInput[] | VehicleInfoUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: VehicleInfoCreateOrConnectWithoutCustomerInput | VehicleInfoCreateOrConnectWithoutCustomerInput[]
    createMany?: VehicleInfoCreateManyCustomerInputEnvelope
    connect?: VehicleInfoWhereUniqueInput | VehicleInfoWhereUniqueInput[]
  }

  export type EnumuserRoleFieldUpdateOperationsInput = {
    set?: $Enums.userRole
  }

  export type VehicleInfoUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<VehicleInfoCreateWithoutCustomerInput, VehicleInfoUncheckedCreateWithoutCustomerInput> | VehicleInfoCreateWithoutCustomerInput[] | VehicleInfoUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: VehicleInfoCreateOrConnectWithoutCustomerInput | VehicleInfoCreateOrConnectWithoutCustomerInput[]
    upsert?: VehicleInfoUpsertWithWhereUniqueWithoutCustomerInput | VehicleInfoUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: VehicleInfoCreateManyCustomerInputEnvelope
    set?: VehicleInfoWhereUniqueInput | VehicleInfoWhereUniqueInput[]
    disconnect?: VehicleInfoWhereUniqueInput | VehicleInfoWhereUniqueInput[]
    delete?: VehicleInfoWhereUniqueInput | VehicleInfoWhereUniqueInput[]
    connect?: VehicleInfoWhereUniqueInput | VehicleInfoWhereUniqueInput[]
    update?: VehicleInfoUpdateWithWhereUniqueWithoutCustomerInput | VehicleInfoUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: VehicleInfoUpdateManyWithWhereWithoutCustomerInput | VehicleInfoUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: VehicleInfoScalarWhereInput | VehicleInfoScalarWhereInput[]
  }

  export type VehicleInfoUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<VehicleInfoCreateWithoutCustomerInput, VehicleInfoUncheckedCreateWithoutCustomerInput> | VehicleInfoCreateWithoutCustomerInput[] | VehicleInfoUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: VehicleInfoCreateOrConnectWithoutCustomerInput | VehicleInfoCreateOrConnectWithoutCustomerInput[]
    upsert?: VehicleInfoUpsertWithWhereUniqueWithoutCustomerInput | VehicleInfoUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: VehicleInfoCreateManyCustomerInputEnvelope
    set?: VehicleInfoWhereUniqueInput | VehicleInfoWhereUniqueInput[]
    disconnect?: VehicleInfoWhereUniqueInput | VehicleInfoWhereUniqueInput[]
    delete?: VehicleInfoWhereUniqueInput | VehicleInfoWhereUniqueInput[]
    connect?: VehicleInfoWhereUniqueInput | VehicleInfoWhereUniqueInput[]
    update?: VehicleInfoUpdateWithWhereUniqueWithoutCustomerInput | VehicleInfoUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: VehicleInfoUpdateManyWithWhereWithoutCustomerInput | VehicleInfoUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: VehicleInfoScalarWhereInput | VehicleInfoScalarWhereInput[]
  }

  export type VehiclesOnGeofencesCreateNestedManyWithoutGeofenceInput = {
    create?: XOR<VehiclesOnGeofencesCreateWithoutGeofenceInput, VehiclesOnGeofencesUncheckedCreateWithoutGeofenceInput> | VehiclesOnGeofencesCreateWithoutGeofenceInput[] | VehiclesOnGeofencesUncheckedCreateWithoutGeofenceInput[]
    connectOrCreate?: VehiclesOnGeofencesCreateOrConnectWithoutGeofenceInput | VehiclesOnGeofencesCreateOrConnectWithoutGeofenceInput[]
    createMany?: VehiclesOnGeofencesCreateManyGeofenceInputEnvelope
    connect?: VehiclesOnGeofencesWhereUniqueInput | VehiclesOnGeofencesWhereUniqueInput[]
  }

  export type VehiclesOnGeofencesUncheckedCreateNestedManyWithoutGeofenceInput = {
    create?: XOR<VehiclesOnGeofencesCreateWithoutGeofenceInput, VehiclesOnGeofencesUncheckedCreateWithoutGeofenceInput> | VehiclesOnGeofencesCreateWithoutGeofenceInput[] | VehiclesOnGeofencesUncheckedCreateWithoutGeofenceInput[]
    connectOrCreate?: VehiclesOnGeofencesCreateOrConnectWithoutGeofenceInput | VehiclesOnGeofencesCreateOrConnectWithoutGeofenceInput[]
    createMany?: VehiclesOnGeofencesCreateManyGeofenceInputEnvelope
    connect?: VehiclesOnGeofencesWhereUniqueInput | VehiclesOnGeofencesWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type VehiclesOnGeofencesUpdateManyWithoutGeofenceNestedInput = {
    create?: XOR<VehiclesOnGeofencesCreateWithoutGeofenceInput, VehiclesOnGeofencesUncheckedCreateWithoutGeofenceInput> | VehiclesOnGeofencesCreateWithoutGeofenceInput[] | VehiclesOnGeofencesUncheckedCreateWithoutGeofenceInput[]
    connectOrCreate?: VehiclesOnGeofencesCreateOrConnectWithoutGeofenceInput | VehiclesOnGeofencesCreateOrConnectWithoutGeofenceInput[]
    upsert?: VehiclesOnGeofencesUpsertWithWhereUniqueWithoutGeofenceInput | VehiclesOnGeofencesUpsertWithWhereUniqueWithoutGeofenceInput[]
    createMany?: VehiclesOnGeofencesCreateManyGeofenceInputEnvelope
    set?: VehiclesOnGeofencesWhereUniqueInput | VehiclesOnGeofencesWhereUniqueInput[]
    disconnect?: VehiclesOnGeofencesWhereUniqueInput | VehiclesOnGeofencesWhereUniqueInput[]
    delete?: VehiclesOnGeofencesWhereUniqueInput | VehiclesOnGeofencesWhereUniqueInput[]
    connect?: VehiclesOnGeofencesWhereUniqueInput | VehiclesOnGeofencesWhereUniqueInput[]
    update?: VehiclesOnGeofencesUpdateWithWhereUniqueWithoutGeofenceInput | VehiclesOnGeofencesUpdateWithWhereUniqueWithoutGeofenceInput[]
    updateMany?: VehiclesOnGeofencesUpdateManyWithWhereWithoutGeofenceInput | VehiclesOnGeofencesUpdateManyWithWhereWithoutGeofenceInput[]
    deleteMany?: VehiclesOnGeofencesScalarWhereInput | VehiclesOnGeofencesScalarWhereInput[]
  }

  export type VehiclesOnGeofencesUncheckedUpdateManyWithoutGeofenceNestedInput = {
    create?: XOR<VehiclesOnGeofencesCreateWithoutGeofenceInput, VehiclesOnGeofencesUncheckedCreateWithoutGeofenceInput> | VehiclesOnGeofencesCreateWithoutGeofenceInput[] | VehiclesOnGeofencesUncheckedCreateWithoutGeofenceInput[]
    connectOrCreate?: VehiclesOnGeofencesCreateOrConnectWithoutGeofenceInput | VehiclesOnGeofencesCreateOrConnectWithoutGeofenceInput[]
    upsert?: VehiclesOnGeofencesUpsertWithWhereUniqueWithoutGeofenceInput | VehiclesOnGeofencesUpsertWithWhereUniqueWithoutGeofenceInput[]
    createMany?: VehiclesOnGeofencesCreateManyGeofenceInputEnvelope
    set?: VehiclesOnGeofencesWhereUniqueInput | VehiclesOnGeofencesWhereUniqueInput[]
    disconnect?: VehiclesOnGeofencesWhereUniqueInput | VehiclesOnGeofencesWhereUniqueInput[]
    delete?: VehiclesOnGeofencesWhereUniqueInput | VehiclesOnGeofencesWhereUniqueInput[]
    connect?: VehiclesOnGeofencesWhereUniqueInput | VehiclesOnGeofencesWhereUniqueInput[]
    update?: VehiclesOnGeofencesUpdateWithWhereUniqueWithoutGeofenceInput | VehiclesOnGeofencesUpdateWithWhereUniqueWithoutGeofenceInput[]
    updateMany?: VehiclesOnGeofencesUpdateManyWithWhereWithoutGeofenceInput | VehiclesOnGeofencesUpdateManyWithWhereWithoutGeofenceInput[]
    deleteMany?: VehiclesOnGeofencesScalarWhereInput | VehiclesOnGeofencesScalarWhereInput[]
  }

  export type VehicleInfoCreateNestedOneWithoutGeofencesInput = {
    create?: XOR<VehicleInfoCreateWithoutGeofencesInput, VehicleInfoUncheckedCreateWithoutGeofencesInput>
    connectOrCreate?: VehicleInfoCreateOrConnectWithoutGeofencesInput
    connect?: VehicleInfoWhereUniqueInput
  }

  export type GeofenceCreateNestedOneWithoutVehiclesInput = {
    create?: XOR<GeofenceCreateWithoutVehiclesInput, GeofenceUncheckedCreateWithoutVehiclesInput>
    connectOrCreate?: GeofenceCreateOrConnectWithoutVehiclesInput
    connect?: GeofenceWhereUniqueInput
  }

  export type VehicleInfoUpdateOneRequiredWithoutGeofencesNestedInput = {
    create?: XOR<VehicleInfoCreateWithoutGeofencesInput, VehicleInfoUncheckedCreateWithoutGeofencesInput>
    connectOrCreate?: VehicleInfoCreateOrConnectWithoutGeofencesInput
    upsert?: VehicleInfoUpsertWithoutGeofencesInput
    connect?: VehicleInfoWhereUniqueInput
    update?: XOR<XOR<VehicleInfoUpdateToOneWithWhereWithoutGeofencesInput, VehicleInfoUpdateWithoutGeofencesInput>, VehicleInfoUncheckedUpdateWithoutGeofencesInput>
  }

  export type GeofenceUpdateOneRequiredWithoutVehiclesNestedInput = {
    create?: XOR<GeofenceCreateWithoutVehiclesInput, GeofenceUncheckedCreateWithoutVehiclesInput>
    connectOrCreate?: GeofenceCreateOrConnectWithoutVehiclesInput
    upsert?: GeofenceUpsertWithoutVehiclesInput
    connect?: GeofenceWhereUniqueInput
    update?: XOR<XOR<GeofenceUpdateToOneWithWhereWithoutVehiclesInput, GeofenceUpdateWithoutVehiclesInput>, GeofenceUncheckedUpdateWithoutVehiclesInput>
  }

  export type VehicleInfoCreateNestedOneWithoutCompliancesInput = {
    create?: XOR<VehicleInfoCreateWithoutCompliancesInput, VehicleInfoUncheckedCreateWithoutCompliancesInput>
    connectOrCreate?: VehicleInfoCreateOrConnectWithoutCompliancesInput
    connect?: VehicleInfoWhereUniqueInput
  }

  export type VehicleInfoUpdateOneRequiredWithoutCompliancesNestedInput = {
    create?: XOR<VehicleInfoCreateWithoutCompliancesInput, VehicleInfoUncheckedCreateWithoutCompliancesInput>
    connectOrCreate?: VehicleInfoCreateOrConnectWithoutCompliancesInput
    upsert?: VehicleInfoUpsertWithoutCompliancesInput
    connect?: VehicleInfoWhereUniqueInput
    update?: XOR<XOR<VehicleInfoUpdateToOneWithWhereWithoutCompliancesInput, VehicleInfoUpdateWithoutCompliancesInput>, VehicleInfoUncheckedUpdateWithoutCompliancesInput>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumuserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.userRole | EnumuserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.userRole[] | ListEnumuserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.userRole[] | ListEnumuserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumuserRoleFilter<$PrismaModel> | $Enums.userRole
  }

  export type NestedEnumuserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.userRole | EnumuserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.userRole[] | ListEnumuserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.userRole[] | ListEnumuserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumuserRoleWithAggregatesFilter<$PrismaModel> | $Enums.userRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumuserRoleFilter<$PrismaModel>
    _max?: NestedEnumuserRoleFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type UserCreateWithoutVehicleInfosInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.userRole
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateWithoutVehicleInfosInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.userRole
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCreateOrConnectWithoutVehicleInfosInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutVehicleInfosInput, UserUncheckedCreateWithoutVehicleInfosInput>
  }

  export type LocationLogCreateWithoutVehicleInput = {
    id?: string
    lat: Decimal | DecimalJsLike | number | string
    lng: Decimal | DecimalJsLike | number | string
    altitude?: Decimal | DecimalJsLike | number | string | null
    speed?: Decimal | DecimalJsLike | number | string | null
    heading?: Decimal | DecimalJsLike | number | string | null
    batteryVoltage?: number | null
    ignition?: boolean
    timestamp: Date | string
    createdAt?: Date | string
  }

  export type LocationLogUncheckedCreateWithoutVehicleInput = {
    id?: string
    lat: Decimal | DecimalJsLike | number | string
    lng: Decimal | DecimalJsLike | number | string
    altitude?: Decimal | DecimalJsLike | number | string | null
    speed?: Decimal | DecimalJsLike | number | string | null
    heading?: Decimal | DecimalJsLike | number | string | null
    batteryVoltage?: number | null
    ignition?: boolean
    timestamp: Date | string
    createdAt?: Date | string
  }

  export type LocationLogCreateOrConnectWithoutVehicleInput = {
    where: LocationLogWhereUniqueInput
    create: XOR<LocationLogCreateWithoutVehicleInput, LocationLogUncheckedCreateWithoutVehicleInput>
  }

  export type LocationLogCreateManyVehicleInputEnvelope = {
    data: LocationLogCreateManyVehicleInput | LocationLogCreateManyVehicleInput[]
    skipDuplicates?: boolean
  }

  export type VehicleComplianceCreateWithoutVehicleInput = {
    id?: string
    fuelQuantity: Decimal | DecimalJsLike | number | string
    fuelRate: Decimal | DecimalJsLike | number | string
    totalCost: Decimal | DecimalJsLike | number | string
    filledLat?: Decimal | DecimalJsLike | number | string | null
    filledLng?: Decimal | DecimalJsLike | number | string | null
    filledAddress?: string | null
    filledBy: string
    receiptUrl?: string | null
    filledAt: Date | string
    createdAt?: Date | string
  }

  export type VehicleComplianceUncheckedCreateWithoutVehicleInput = {
    id?: string
    fuelQuantity: Decimal | DecimalJsLike | number | string
    fuelRate: Decimal | DecimalJsLike | number | string
    totalCost: Decimal | DecimalJsLike | number | string
    filledLat?: Decimal | DecimalJsLike | number | string | null
    filledLng?: Decimal | DecimalJsLike | number | string | null
    filledAddress?: string | null
    filledBy: string
    receiptUrl?: string | null
    filledAt: Date | string
    createdAt?: Date | string
  }

  export type VehicleComplianceCreateOrConnectWithoutVehicleInput = {
    where: VehicleComplianceWhereUniqueInput
    create: XOR<VehicleComplianceCreateWithoutVehicleInput, VehicleComplianceUncheckedCreateWithoutVehicleInput>
  }

  export type VehicleComplianceCreateManyVehicleInputEnvelope = {
    data: VehicleComplianceCreateManyVehicleInput | VehicleComplianceCreateManyVehicleInput[]
    skipDuplicates?: boolean
  }

  export type VehiclesOnGeofencesCreateWithoutVehicleInput = {
    assignedAt?: Date | string
    geofence: GeofenceCreateNestedOneWithoutVehiclesInput
  }

  export type VehiclesOnGeofencesUncheckedCreateWithoutVehicleInput = {
    geofenceId: string
    assignedAt?: Date | string
  }

  export type VehiclesOnGeofencesCreateOrConnectWithoutVehicleInput = {
    where: VehiclesOnGeofencesWhereUniqueInput
    create: XOR<VehiclesOnGeofencesCreateWithoutVehicleInput, VehiclesOnGeofencesUncheckedCreateWithoutVehicleInput>
  }

  export type VehiclesOnGeofencesCreateManyVehicleInputEnvelope = {
    data: VehiclesOnGeofencesCreateManyVehicleInput | VehiclesOnGeofencesCreateManyVehicleInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutVehicleInfosInput = {
    update: XOR<UserUpdateWithoutVehicleInfosInput, UserUncheckedUpdateWithoutVehicleInfosInput>
    create: XOR<UserCreateWithoutVehicleInfosInput, UserUncheckedCreateWithoutVehicleInfosInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutVehicleInfosInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutVehicleInfosInput, UserUncheckedUpdateWithoutVehicleInfosInput>
  }

  export type UserUpdateWithoutVehicleInfosInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumuserRoleFieldUpdateOperationsInput | $Enums.userRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateWithoutVehicleInfosInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumuserRoleFieldUpdateOperationsInput | $Enums.userRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocationLogUpsertWithWhereUniqueWithoutVehicleInput = {
    where: LocationLogWhereUniqueInput
    update: XOR<LocationLogUpdateWithoutVehicleInput, LocationLogUncheckedUpdateWithoutVehicleInput>
    create: XOR<LocationLogCreateWithoutVehicleInput, LocationLogUncheckedCreateWithoutVehicleInput>
  }

  export type LocationLogUpdateWithWhereUniqueWithoutVehicleInput = {
    where: LocationLogWhereUniqueInput
    data: XOR<LocationLogUpdateWithoutVehicleInput, LocationLogUncheckedUpdateWithoutVehicleInput>
  }

  export type LocationLogUpdateManyWithWhereWithoutVehicleInput = {
    where: LocationLogScalarWhereInput
    data: XOR<LocationLogUpdateManyMutationInput, LocationLogUncheckedUpdateManyWithoutVehicleInput>
  }

  export type LocationLogScalarWhereInput = {
    AND?: LocationLogScalarWhereInput | LocationLogScalarWhereInput[]
    OR?: LocationLogScalarWhereInput[]
    NOT?: LocationLogScalarWhereInput | LocationLogScalarWhereInput[]
    id?: UuidFilter<"LocationLog"> | string
    imei?: StringFilter<"LocationLog"> | string
    lat?: DecimalFilter<"LocationLog"> | Decimal | DecimalJsLike | number | string
    lng?: DecimalFilter<"LocationLog"> | Decimal | DecimalJsLike | number | string
    altitude?: DecimalNullableFilter<"LocationLog"> | Decimal | DecimalJsLike | number | string | null
    speed?: DecimalNullableFilter<"LocationLog"> | Decimal | DecimalJsLike | number | string | null
    heading?: DecimalNullableFilter<"LocationLog"> | Decimal | DecimalJsLike | number | string | null
    batteryVoltage?: FloatNullableFilter<"LocationLog"> | number | null
    ignition?: BoolFilter<"LocationLog"> | boolean
    timestamp?: DateTimeFilter<"LocationLog"> | Date | string
    createdAt?: DateTimeFilter<"LocationLog"> | Date | string
  }

  export type VehicleComplianceUpsertWithWhereUniqueWithoutVehicleInput = {
    where: VehicleComplianceWhereUniqueInput
    update: XOR<VehicleComplianceUpdateWithoutVehicleInput, VehicleComplianceUncheckedUpdateWithoutVehicleInput>
    create: XOR<VehicleComplianceCreateWithoutVehicleInput, VehicleComplianceUncheckedCreateWithoutVehicleInput>
  }

  export type VehicleComplianceUpdateWithWhereUniqueWithoutVehicleInput = {
    where: VehicleComplianceWhereUniqueInput
    data: XOR<VehicleComplianceUpdateWithoutVehicleInput, VehicleComplianceUncheckedUpdateWithoutVehicleInput>
  }

  export type VehicleComplianceUpdateManyWithWhereWithoutVehicleInput = {
    where: VehicleComplianceScalarWhereInput
    data: XOR<VehicleComplianceUpdateManyMutationInput, VehicleComplianceUncheckedUpdateManyWithoutVehicleInput>
  }

  export type VehicleComplianceScalarWhereInput = {
    AND?: VehicleComplianceScalarWhereInput | VehicleComplianceScalarWhereInput[]
    OR?: VehicleComplianceScalarWhereInput[]
    NOT?: VehicleComplianceScalarWhereInput | VehicleComplianceScalarWhereInput[]
    id?: UuidFilter<"VehicleCompliance"> | string
    vehicleId?: UuidFilter<"VehicleCompliance"> | string
    fuelQuantity?: DecimalFilter<"VehicleCompliance"> | Decimal | DecimalJsLike | number | string
    fuelRate?: DecimalFilter<"VehicleCompliance"> | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFilter<"VehicleCompliance"> | Decimal | DecimalJsLike | number | string
    filledLat?: DecimalNullableFilter<"VehicleCompliance"> | Decimal | DecimalJsLike | number | string | null
    filledLng?: DecimalNullableFilter<"VehicleCompliance"> | Decimal | DecimalJsLike | number | string | null
    filledAddress?: StringNullableFilter<"VehicleCompliance"> | string | null
    filledBy?: StringFilter<"VehicleCompliance"> | string
    receiptUrl?: StringNullableFilter<"VehicleCompliance"> | string | null
    filledAt?: DateTimeFilter<"VehicleCompliance"> | Date | string
    createdAt?: DateTimeFilter<"VehicleCompliance"> | Date | string
  }

  export type VehiclesOnGeofencesUpsertWithWhereUniqueWithoutVehicleInput = {
    where: VehiclesOnGeofencesWhereUniqueInput
    update: XOR<VehiclesOnGeofencesUpdateWithoutVehicleInput, VehiclesOnGeofencesUncheckedUpdateWithoutVehicleInput>
    create: XOR<VehiclesOnGeofencesCreateWithoutVehicleInput, VehiclesOnGeofencesUncheckedCreateWithoutVehicleInput>
  }

  export type VehiclesOnGeofencesUpdateWithWhereUniqueWithoutVehicleInput = {
    where: VehiclesOnGeofencesWhereUniqueInput
    data: XOR<VehiclesOnGeofencesUpdateWithoutVehicleInput, VehiclesOnGeofencesUncheckedUpdateWithoutVehicleInput>
  }

  export type VehiclesOnGeofencesUpdateManyWithWhereWithoutVehicleInput = {
    where: VehiclesOnGeofencesScalarWhereInput
    data: XOR<VehiclesOnGeofencesUpdateManyMutationInput, VehiclesOnGeofencesUncheckedUpdateManyWithoutVehicleInput>
  }

  export type VehiclesOnGeofencesScalarWhereInput = {
    AND?: VehiclesOnGeofencesScalarWhereInput | VehiclesOnGeofencesScalarWhereInput[]
    OR?: VehiclesOnGeofencesScalarWhereInput[]
    NOT?: VehiclesOnGeofencesScalarWhereInput | VehiclesOnGeofencesScalarWhereInput[]
    vehicleId?: UuidFilter<"VehiclesOnGeofences"> | string
    geofenceId?: UuidFilter<"VehiclesOnGeofences"> | string
    assignedAt?: DateTimeFilter<"VehiclesOnGeofences"> | Date | string
  }

  export type VehicleInfoCreateWithoutLocationsInput = {
    id?: string
    imei: string
    vechicleNumb: string
    createdAt?: Date | string
    updatedAt?: Date | string
    customer: UserCreateNestedOneWithoutVehicleInfosInput
    compliances?: VehicleComplianceCreateNestedManyWithoutVehicleInput
    geofences?: VehiclesOnGeofencesCreateNestedManyWithoutVehicleInput
  }

  export type VehicleInfoUncheckedCreateWithoutLocationsInput = {
    id?: string
    imei: string
    vechicleNumb: string
    customerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    compliances?: VehicleComplianceUncheckedCreateNestedManyWithoutVehicleInput
    geofences?: VehiclesOnGeofencesUncheckedCreateNestedManyWithoutVehicleInput
  }

  export type VehicleInfoCreateOrConnectWithoutLocationsInput = {
    where: VehicleInfoWhereUniqueInput
    create: XOR<VehicleInfoCreateWithoutLocationsInput, VehicleInfoUncheckedCreateWithoutLocationsInput>
  }

  export type VehicleInfoUpsertWithoutLocationsInput = {
    update: XOR<VehicleInfoUpdateWithoutLocationsInput, VehicleInfoUncheckedUpdateWithoutLocationsInput>
    create: XOR<VehicleInfoCreateWithoutLocationsInput, VehicleInfoUncheckedCreateWithoutLocationsInput>
    where?: VehicleInfoWhereInput
  }

  export type VehicleInfoUpdateToOneWithWhereWithoutLocationsInput = {
    where?: VehicleInfoWhereInput
    data: XOR<VehicleInfoUpdateWithoutLocationsInput, VehicleInfoUncheckedUpdateWithoutLocationsInput>
  }

  export type VehicleInfoUpdateWithoutLocationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    imei?: StringFieldUpdateOperationsInput | string
    vechicleNumb?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: UserUpdateOneRequiredWithoutVehicleInfosNestedInput
    compliances?: VehicleComplianceUpdateManyWithoutVehicleNestedInput
    geofences?: VehiclesOnGeofencesUpdateManyWithoutVehicleNestedInput
  }

  export type VehicleInfoUncheckedUpdateWithoutLocationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    imei?: StringFieldUpdateOperationsInput | string
    vechicleNumb?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    compliances?: VehicleComplianceUncheckedUpdateManyWithoutVehicleNestedInput
    geofences?: VehiclesOnGeofencesUncheckedUpdateManyWithoutVehicleNestedInput
  }

  export type VehicleInfoCreateWithoutCustomerInput = {
    id?: string
    imei: string
    vechicleNumb: string
    createdAt?: Date | string
    updatedAt?: Date | string
    locations?: LocationLogCreateNestedManyWithoutVehicleInput
    compliances?: VehicleComplianceCreateNestedManyWithoutVehicleInput
    geofences?: VehiclesOnGeofencesCreateNestedManyWithoutVehicleInput
  }

  export type VehicleInfoUncheckedCreateWithoutCustomerInput = {
    id?: string
    imei: string
    vechicleNumb: string
    createdAt?: Date | string
    updatedAt?: Date | string
    locations?: LocationLogUncheckedCreateNestedManyWithoutVehicleInput
    compliances?: VehicleComplianceUncheckedCreateNestedManyWithoutVehicleInput
    geofences?: VehiclesOnGeofencesUncheckedCreateNestedManyWithoutVehicleInput
  }

  export type VehicleInfoCreateOrConnectWithoutCustomerInput = {
    where: VehicleInfoWhereUniqueInput
    create: XOR<VehicleInfoCreateWithoutCustomerInput, VehicleInfoUncheckedCreateWithoutCustomerInput>
  }

  export type VehicleInfoCreateManyCustomerInputEnvelope = {
    data: VehicleInfoCreateManyCustomerInput | VehicleInfoCreateManyCustomerInput[]
    skipDuplicates?: boolean
  }

  export type VehicleInfoUpsertWithWhereUniqueWithoutCustomerInput = {
    where: VehicleInfoWhereUniqueInput
    update: XOR<VehicleInfoUpdateWithoutCustomerInput, VehicleInfoUncheckedUpdateWithoutCustomerInput>
    create: XOR<VehicleInfoCreateWithoutCustomerInput, VehicleInfoUncheckedCreateWithoutCustomerInput>
  }

  export type VehicleInfoUpdateWithWhereUniqueWithoutCustomerInput = {
    where: VehicleInfoWhereUniqueInput
    data: XOR<VehicleInfoUpdateWithoutCustomerInput, VehicleInfoUncheckedUpdateWithoutCustomerInput>
  }

  export type VehicleInfoUpdateManyWithWhereWithoutCustomerInput = {
    where: VehicleInfoScalarWhereInput
    data: XOR<VehicleInfoUpdateManyMutationInput, VehicleInfoUncheckedUpdateManyWithoutCustomerInput>
  }

  export type VehicleInfoScalarWhereInput = {
    AND?: VehicleInfoScalarWhereInput | VehicleInfoScalarWhereInput[]
    OR?: VehicleInfoScalarWhereInput[]
    NOT?: VehicleInfoScalarWhereInput | VehicleInfoScalarWhereInput[]
    id?: UuidFilter<"VehicleInfo"> | string
    imei?: StringFilter<"VehicleInfo"> | string
    vechicleNumb?: StringFilter<"VehicleInfo"> | string
    customerId?: UuidFilter<"VehicleInfo"> | string
    createdAt?: DateTimeFilter<"VehicleInfo"> | Date | string
    updatedAt?: DateTimeFilter<"VehicleInfo"> | Date | string
  }

  export type VehiclesOnGeofencesCreateWithoutGeofenceInput = {
    assignedAt?: Date | string
    vehicle: VehicleInfoCreateNestedOneWithoutGeofencesInput
  }

  export type VehiclesOnGeofencesUncheckedCreateWithoutGeofenceInput = {
    vehicleId: string
    assignedAt?: Date | string
  }

  export type VehiclesOnGeofencesCreateOrConnectWithoutGeofenceInput = {
    where: VehiclesOnGeofencesWhereUniqueInput
    create: XOR<VehiclesOnGeofencesCreateWithoutGeofenceInput, VehiclesOnGeofencesUncheckedCreateWithoutGeofenceInput>
  }

  export type VehiclesOnGeofencesCreateManyGeofenceInputEnvelope = {
    data: VehiclesOnGeofencesCreateManyGeofenceInput | VehiclesOnGeofencesCreateManyGeofenceInput[]
    skipDuplicates?: boolean
  }

  export type VehiclesOnGeofencesUpsertWithWhereUniqueWithoutGeofenceInput = {
    where: VehiclesOnGeofencesWhereUniqueInput
    update: XOR<VehiclesOnGeofencesUpdateWithoutGeofenceInput, VehiclesOnGeofencesUncheckedUpdateWithoutGeofenceInput>
    create: XOR<VehiclesOnGeofencesCreateWithoutGeofenceInput, VehiclesOnGeofencesUncheckedCreateWithoutGeofenceInput>
  }

  export type VehiclesOnGeofencesUpdateWithWhereUniqueWithoutGeofenceInput = {
    where: VehiclesOnGeofencesWhereUniqueInput
    data: XOR<VehiclesOnGeofencesUpdateWithoutGeofenceInput, VehiclesOnGeofencesUncheckedUpdateWithoutGeofenceInput>
  }

  export type VehiclesOnGeofencesUpdateManyWithWhereWithoutGeofenceInput = {
    where: VehiclesOnGeofencesScalarWhereInput
    data: XOR<VehiclesOnGeofencesUpdateManyMutationInput, VehiclesOnGeofencesUncheckedUpdateManyWithoutGeofenceInput>
  }

  export type VehicleInfoCreateWithoutGeofencesInput = {
    id?: string
    imei: string
    vechicleNumb: string
    createdAt?: Date | string
    updatedAt?: Date | string
    customer: UserCreateNestedOneWithoutVehicleInfosInput
    locations?: LocationLogCreateNestedManyWithoutVehicleInput
    compliances?: VehicleComplianceCreateNestedManyWithoutVehicleInput
  }

  export type VehicleInfoUncheckedCreateWithoutGeofencesInput = {
    id?: string
    imei: string
    vechicleNumb: string
    customerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    locations?: LocationLogUncheckedCreateNestedManyWithoutVehicleInput
    compliances?: VehicleComplianceUncheckedCreateNestedManyWithoutVehicleInput
  }

  export type VehicleInfoCreateOrConnectWithoutGeofencesInput = {
    where: VehicleInfoWhereUniqueInput
    create: XOR<VehicleInfoCreateWithoutGeofencesInput, VehicleInfoUncheckedCreateWithoutGeofencesInput>
  }

  export type GeofenceCreateWithoutVehiclesInput = {
    id?: string
    name: string
    zoneHash?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GeofenceUncheckedCreateWithoutVehiclesInput = {
    id?: string
    name: string
    zoneHash?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GeofenceCreateOrConnectWithoutVehiclesInput = {
    where: GeofenceWhereUniqueInput
    create: XOR<GeofenceCreateWithoutVehiclesInput, GeofenceUncheckedCreateWithoutVehiclesInput>
  }

  export type VehicleInfoUpsertWithoutGeofencesInput = {
    update: XOR<VehicleInfoUpdateWithoutGeofencesInput, VehicleInfoUncheckedUpdateWithoutGeofencesInput>
    create: XOR<VehicleInfoCreateWithoutGeofencesInput, VehicleInfoUncheckedCreateWithoutGeofencesInput>
    where?: VehicleInfoWhereInput
  }

  export type VehicleInfoUpdateToOneWithWhereWithoutGeofencesInput = {
    where?: VehicleInfoWhereInput
    data: XOR<VehicleInfoUpdateWithoutGeofencesInput, VehicleInfoUncheckedUpdateWithoutGeofencesInput>
  }

  export type VehicleInfoUpdateWithoutGeofencesInput = {
    id?: StringFieldUpdateOperationsInput | string
    imei?: StringFieldUpdateOperationsInput | string
    vechicleNumb?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: UserUpdateOneRequiredWithoutVehicleInfosNestedInput
    locations?: LocationLogUpdateManyWithoutVehicleNestedInput
    compliances?: VehicleComplianceUpdateManyWithoutVehicleNestedInput
  }

  export type VehicleInfoUncheckedUpdateWithoutGeofencesInput = {
    id?: StringFieldUpdateOperationsInput | string
    imei?: StringFieldUpdateOperationsInput | string
    vechicleNumb?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: LocationLogUncheckedUpdateManyWithoutVehicleNestedInput
    compliances?: VehicleComplianceUncheckedUpdateManyWithoutVehicleNestedInput
  }

  export type GeofenceUpsertWithoutVehiclesInput = {
    update: XOR<GeofenceUpdateWithoutVehiclesInput, GeofenceUncheckedUpdateWithoutVehiclesInput>
    create: XOR<GeofenceCreateWithoutVehiclesInput, GeofenceUncheckedCreateWithoutVehiclesInput>
    where?: GeofenceWhereInput
  }

  export type GeofenceUpdateToOneWithWhereWithoutVehiclesInput = {
    where?: GeofenceWhereInput
    data: XOR<GeofenceUpdateWithoutVehiclesInput, GeofenceUncheckedUpdateWithoutVehiclesInput>
  }

  export type GeofenceUpdateWithoutVehiclesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    zoneHash?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GeofenceUncheckedUpdateWithoutVehiclesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    zoneHash?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VehicleInfoCreateWithoutCompliancesInput = {
    id?: string
    imei: string
    vechicleNumb: string
    createdAt?: Date | string
    updatedAt?: Date | string
    customer: UserCreateNestedOneWithoutVehicleInfosInput
    locations?: LocationLogCreateNestedManyWithoutVehicleInput
    geofences?: VehiclesOnGeofencesCreateNestedManyWithoutVehicleInput
  }

  export type VehicleInfoUncheckedCreateWithoutCompliancesInput = {
    id?: string
    imei: string
    vechicleNumb: string
    customerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    locations?: LocationLogUncheckedCreateNestedManyWithoutVehicleInput
    geofences?: VehiclesOnGeofencesUncheckedCreateNestedManyWithoutVehicleInput
  }

  export type VehicleInfoCreateOrConnectWithoutCompliancesInput = {
    where: VehicleInfoWhereUniqueInput
    create: XOR<VehicleInfoCreateWithoutCompliancesInput, VehicleInfoUncheckedCreateWithoutCompliancesInput>
  }

  export type VehicleInfoUpsertWithoutCompliancesInput = {
    update: XOR<VehicleInfoUpdateWithoutCompliancesInput, VehicleInfoUncheckedUpdateWithoutCompliancesInput>
    create: XOR<VehicleInfoCreateWithoutCompliancesInput, VehicleInfoUncheckedCreateWithoutCompliancesInput>
    where?: VehicleInfoWhereInput
  }

  export type VehicleInfoUpdateToOneWithWhereWithoutCompliancesInput = {
    where?: VehicleInfoWhereInput
    data: XOR<VehicleInfoUpdateWithoutCompliancesInput, VehicleInfoUncheckedUpdateWithoutCompliancesInput>
  }

  export type VehicleInfoUpdateWithoutCompliancesInput = {
    id?: StringFieldUpdateOperationsInput | string
    imei?: StringFieldUpdateOperationsInput | string
    vechicleNumb?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: UserUpdateOneRequiredWithoutVehicleInfosNestedInput
    locations?: LocationLogUpdateManyWithoutVehicleNestedInput
    geofences?: VehiclesOnGeofencesUpdateManyWithoutVehicleNestedInput
  }

  export type VehicleInfoUncheckedUpdateWithoutCompliancesInput = {
    id?: StringFieldUpdateOperationsInput | string
    imei?: StringFieldUpdateOperationsInput | string
    vechicleNumb?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: LocationLogUncheckedUpdateManyWithoutVehicleNestedInput
    geofences?: VehiclesOnGeofencesUncheckedUpdateManyWithoutVehicleNestedInput
  }

  export type LocationLogCreateManyVehicleInput = {
    id?: string
    lat: Decimal | DecimalJsLike | number | string
    lng: Decimal | DecimalJsLike | number | string
    altitude?: Decimal | DecimalJsLike | number | string | null
    speed?: Decimal | DecimalJsLike | number | string | null
    heading?: Decimal | DecimalJsLike | number | string | null
    batteryVoltage?: number | null
    ignition?: boolean
    timestamp: Date | string
    createdAt?: Date | string
  }

  export type VehicleComplianceCreateManyVehicleInput = {
    id?: string
    fuelQuantity: Decimal | DecimalJsLike | number | string
    fuelRate: Decimal | DecimalJsLike | number | string
    totalCost: Decimal | DecimalJsLike | number | string
    filledLat?: Decimal | DecimalJsLike | number | string | null
    filledLng?: Decimal | DecimalJsLike | number | string | null
    filledAddress?: string | null
    filledBy: string
    receiptUrl?: string | null
    filledAt: Date | string
    createdAt?: Date | string
  }

  export type VehiclesOnGeofencesCreateManyVehicleInput = {
    geofenceId: string
    assignedAt?: Date | string
  }

  export type LocationLogUpdateWithoutVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    lat?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lng?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    altitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    speed?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    heading?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    batteryVoltage?: NullableFloatFieldUpdateOperationsInput | number | null
    ignition?: BoolFieldUpdateOperationsInput | boolean
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocationLogUncheckedUpdateWithoutVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    lat?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lng?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    altitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    speed?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    heading?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    batteryVoltage?: NullableFloatFieldUpdateOperationsInput | number | null
    ignition?: BoolFieldUpdateOperationsInput | boolean
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocationLogUncheckedUpdateManyWithoutVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    lat?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lng?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    altitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    speed?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    heading?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    batteryVoltage?: NullableFloatFieldUpdateOperationsInput | number | null
    ignition?: BoolFieldUpdateOperationsInput | boolean
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VehicleComplianceUpdateWithoutVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    fuelQuantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fuelRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    filledLat?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    filledLng?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    filledAddress?: NullableStringFieldUpdateOperationsInput | string | null
    filledBy?: StringFieldUpdateOperationsInput | string
    receiptUrl?: NullableStringFieldUpdateOperationsInput | string | null
    filledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VehicleComplianceUncheckedUpdateWithoutVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    fuelQuantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fuelRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    filledLat?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    filledLng?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    filledAddress?: NullableStringFieldUpdateOperationsInput | string | null
    filledBy?: StringFieldUpdateOperationsInput | string
    receiptUrl?: NullableStringFieldUpdateOperationsInput | string | null
    filledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VehicleComplianceUncheckedUpdateManyWithoutVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    fuelQuantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fuelRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    filledLat?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    filledLng?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    filledAddress?: NullableStringFieldUpdateOperationsInput | string | null
    filledBy?: StringFieldUpdateOperationsInput | string
    receiptUrl?: NullableStringFieldUpdateOperationsInput | string | null
    filledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VehiclesOnGeofencesUpdateWithoutVehicleInput = {
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    geofence?: GeofenceUpdateOneRequiredWithoutVehiclesNestedInput
  }

  export type VehiclesOnGeofencesUncheckedUpdateWithoutVehicleInput = {
    geofenceId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VehiclesOnGeofencesUncheckedUpdateManyWithoutVehicleInput = {
    geofenceId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VehicleInfoCreateManyCustomerInput = {
    id?: string
    imei: string
    vechicleNumb: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VehicleInfoUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    imei?: StringFieldUpdateOperationsInput | string
    vechicleNumb?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: LocationLogUpdateManyWithoutVehicleNestedInput
    compliances?: VehicleComplianceUpdateManyWithoutVehicleNestedInput
    geofences?: VehiclesOnGeofencesUpdateManyWithoutVehicleNestedInput
  }

  export type VehicleInfoUncheckedUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    imei?: StringFieldUpdateOperationsInput | string
    vechicleNumb?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: LocationLogUncheckedUpdateManyWithoutVehicleNestedInput
    compliances?: VehicleComplianceUncheckedUpdateManyWithoutVehicleNestedInput
    geofences?: VehiclesOnGeofencesUncheckedUpdateManyWithoutVehicleNestedInput
  }

  export type VehicleInfoUncheckedUpdateManyWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    imei?: StringFieldUpdateOperationsInput | string
    vechicleNumb?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VehiclesOnGeofencesCreateManyGeofenceInput = {
    vehicleId: string
    assignedAt?: Date | string
  }

  export type VehiclesOnGeofencesUpdateWithoutGeofenceInput = {
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicle?: VehicleInfoUpdateOneRequiredWithoutGeofencesNestedInput
  }

  export type VehiclesOnGeofencesUncheckedUpdateWithoutGeofenceInput = {
    vehicleId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VehiclesOnGeofencesUncheckedUpdateManyWithoutGeofenceInput = {
    vehicleId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}