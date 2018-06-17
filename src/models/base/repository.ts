import Model from 'models/base/model'
import { FirebaseFirestore } from '@firebase/firestore-types';

export default class Repository<T extends Model> {
  firestore: FirebaseFirestore;
  path: string
  
  constructor(public coll: CollectionReference<T>) {
    this.firestore = coll.firestore
    this.path = coll.path
    this.coll = coll
  }
  
  private toData(item: T): any {
    const data = {} as any
    for (const key in item) {
      if (key.length && key[0] !== '_') {
        const val = item[key]
        data[key] = val === undefined ? null : val
      }
    }
    console.log('data', data)
    return data
  }

  // cache(key: string, value?: any): any {
  //   key = this.path + ':' + key
  //   if (value !== undefined) {
  //     localStorage.setItem(key, JSON.stringify(value))
  //     return value
  //   }
  //   const json = localStorage.getItem(key)
  //   if (!json) {
  //     return undefined
  //   }
  //   const item = JSON.parse(json)
  //   return item
  // }
  
  private toItem(snap: DocumentSnapshot<T>): T|undefined {
    let item = snap.data()
    //this.cache(snap.id, item)
    if (item === undefined) {
      return undefined
    }
    item._id = snap.id
    console.log('item', item)
    return item
  }
  
  items(query?: Query<T>): Promise<T[]> {
    console.log('items', query)
    const queryPromise = !query ? this.coll.get() : query.get()
    return queryPromise.then(
      ({docs}) => {
        const items = docs.map(snap => this.toItem(snap))
        console.log('results', items)
        //this.cache(query.toString(), items.map(p => p._id))
        return items
      }
    )
  }

  get(id: string): Promise<T> {
    return this.coll.doc(id).get().then(snap => this.toItem(snap))
  }

  // getCacheItems(query: Query<T>): T[] {
  //   console.log('getCacheItems', query)
  //   const ids = this.cache(query.toString()) as string[]
  //   if (!ids || !ids.length) return []
  //   const items = ids.map(id => this.getCacheItem(id))
  //   return items
  // }

  // getCacheItem(id: string): T {
  //   console.log('getCacheItem', id)
  //   return this.cache(id)
  // }
  
  set(item: T): Promise<T> {
    const data = this.toData(item)
    if (item._id) {
      return this.coll.doc(item._id).set(data).then(() => item)
    } else {
      return this.coll.add(data).then(doc => {
        item._id = doc.id
        return item
      })
    }
  }
  
  merge(item: T): Promise<T> {
    const data = this.toData(item)
    if (item._id) {
      return this.coll.doc(item._id).set(data, { merge: true }).then(() => item)
    } else {
      return this.coll.add(data).then(doc => {
        item._id = doc.id
        return item
      })
    }
  }

  delete(itemOrId: T|string): Promise<void> {
    if (typeof itemOrId === 'string') {
      return this.coll.doc(itemOrId).delete()
    }
    if (typeof itemOrId._id === 'string') {
      return this.coll.doc(itemOrId._id).delete()
    }
    return Promise.resolve()
  }

  // doc(documentPath?: string) { return this.coll.doc(documentPath) }


  // /**
  //  * Writes to the document referred to by the id.
  //  * If the document does not yet exist, it will be created.
  //  * If you pass `SetOptions`, the provided data can be merged into an existing document.
  //  *
  //  * @param id A document id.
  //  * @param data A map of the fields and values for the document.
  //  * @param options An object to configure the set behavior.
  //  * @return A Promise resolved once the data has been successfully written
  //  * to the backend (Note that it won't resolve while you're offline).
  //  */
  // set(id: string, data: any, options?: SetOptions): Promise<void> {
  //   console.log('set', this.path, id, data, options)
  //   // const cache = this.cache(id)
  //   // if (options.merge) {
  //   //   this.cache(id, { ...cache, ...(data as any) })
  //   // } else {
  //   //   this.cache(id, data)
  //   // }
  //   return this.doc(id).set(data, options)
  // }

  // /**
  //  * Writes to the document referred to by the id. 
  //  * If the document does not yet exist, it will be created. 
  //  * If the document exist the provided data are merged with the existing document.
  //  * 
  //  * @param id A document id.
  //  * @param data A map of the fields and values for the document.
  //  * @return A Promise resolved once the data has been successfully written
  //  * to the backend (Note that it won't resolve while you're offline).
  //  */
  // merge(id: string, data: any): Promise<void> {
  //   return this.set(id, data, { merge: true })
  // }

  // /**
  //  * Add a new document to this collection with the specified data, assigning
  //  * it a document ID automatically.
  //  *
  //  * @param data An Object containing the data for the new document.
  //  * @return A Promise resolved with a `DocumentReference` pointing to the
  //  * newly created document after it has been written to the backend.
  //  */
  // add(data: any): Promise<DocumentReference<T>> {
  //   console.log('add', this.path, data)
  //   return this.coll.add(data)
  //   // .then(p => {
  //   //   this.cache(p.id, data)
  //   //   return p
  //   // })
  // }

  // /**
  //  * Reads the document referred to by this `DocumentReference`.
  //  *
  //  * Note: get() attempts to provide up-to-date data when possible by waiting
  //  * for data from the server, but it may return cached data or fail if you
  //  * are offline and the server cannot be reached.
  //  *
  //  * @return A Promise resolved with a DocumentSnapshot containing the
  //  * current document contents.
  //  */
  // get(id: string): Promise<DocumentSnapshot<T>> {
  //   return this.doc(id).get() as Promise<DocumentSnapshot<T>>
  // }

  // /**
  //  * Attaches a listener for DocumentSnapshot events. You may either pass
  //  * individual `onNext` and `onError` callbacks or pass a single observer
  //  * object with `next` and `error` callbacks.
  //  *
  //  * NOTE: Although an `onCompletion` callback can be provided, it will
  //  * never be called because the snapshot stream is never-ending.
  //  *
  //  * @param options Options controlling the listen behavior.
  //  * @param onNext A callback to be called every time a new `DocumentSnapshot`
  //  * is available.
  //  * @param onError A callback to be called if the listen fails or is
  //  * cancelled. No further callbacks will occur.
  //  * @param observer A single object containing `next` and `error` callbacks.
  //  * @return An unsubscribe function that can be called to cancel
  //  * the snapshot listener.
  //  */
  // onSnapshot(
  //   id: string,
  //   onNext: (snapshot: DocumentSnapshot<T>) => void,
  //   onError?: (error: Error) => void,
  //   onCompletion?: () => void
  // ): () => void {
  //   return this.doc(id).onSnapshot(onNext, onError, onCompletion)
  // }

  onItem(
    id: string,
    onNext: (item: T) => void,
    onError?: (error: Error) => void,
    onCompletion?: () => void
  ): () => void {
    return this.coll.doc(id).onSnapshot(snap => onNext(this.toItem(snap)), onError, onCompletion)
  }

  /**
   * Creates and returns a new Query with the additional filter that documents
   * must contain the specified field and the value should satisfy the
   * relation constraint provided.
   *
   * @param fieldPath The path to compare
   * @param opStr The operation string (e.g "<", "<=", "==", ">", ">=").
   * @param value The value for comparison
   * @return The created Query.
   */
  where(
    fieldPath: string | FieldPath,
    opStr: WhereFilterOp,
    value: any
  ): Query<T> {
    return this.coll.where(fieldPath, opStr, value)
  }
}










export type SnapshotOptions = any// firebase.firestore.SnapshotOptions
export type FieldPath = any// firebase.firestore.FieldPath
export type WhereFilterOp = any// firebase.firestore.WhereFilterOp
export type OrderByDirection = any// firebase.firestore.OrderByDirection
export type QueryListenOptions = any// firebase.firestore.QueryListenOptions
export type SetOptions = any// firebase.firestore.SetOptions
export type FirestoreError = any// firebase.firestore.FirestoreError
export type DocumentListenOptions = any// firebase.firestore.DocumentListenOptions
export type SnapshotMetadata = any// firebase.firestore.SnapshotMetadata
export type DocumentChange = any// firebase.firestore.DocumentChange
export type Firestore = any// firebase.firestore.DocumentChange

/**
 * A `DocumentReference` refers to a document location in a Firestore database
 * and can be used to write, read, or listen to the location. The document at
 * the referenced location may or may not exist. A `DocumentReference` can
 * also be used to create a `CollectionReference` to a subcollection.
 */
export declare class DocumentReference<T> {
  private constructor()

  /** The identifier of the document within its collection. */
  readonly id: string

  /**
   * The `Firestore` for the Firestore database (useful for performing
   * transactions, etc.).
   */
  readonly firestore: Firestore
  
  /**
   * A reference to the Collection to which this DocumentReference belongs.
   */
  readonly parent: CollectionReference<T>

  /**
   * A string representing the path of the referenced document (relative
   * to the root of the database).
   */
  readonly path: string

  /**
   * Gets a `CollectionReference` instance that refers to the collection at
   * the specified path.
   *
   * @param collectionPath A slash-separated path to a collection.
   * @return The `CollectionReference` instance.
   */
  collection<T>(collectionPath: string): CollectionReference<T>
  
  /**
   * Returns true if this `DocumentReference` is equal to the provided one.
   *
   * @param other The `DocumentReference` to compare against.
   * @return true if this `DocumentReference` is equal to the provided one.
   */
  isEqual(other: DocumentReference<T>): boolean

  /**
   * Writes to the document referred to by this `DocumentReference`. If the
   * document does not yet exist, it will be created. If you pass
   * `SetOptions`, the provided data can be merged into an existing document.
   *
   * @param data A map of the fields and values for the document.
   * @param options An object to configure the set behavior.
   * @return A Promise resolved once the data has been successfully written
   * to the backend (Note that it won't resolve while you're offline).
   */
  set(data: T, options?: SetOptions): Promise<void>

  /**
   * Updates fields in the document referred to by this `DocumentReference`.
   * The update will fail if applied to a document that does not exist.
   *
   * @param data An object containing the fields and values with which to
   * update the document. Fields can contain dots to reference nested fields
   * within the document.
   * @return A Promise resolved once the data has been successfully written
   * to the backend (Note that it won't resolve while you're offline).
   */
  update(data: T): Promise<void>

  /**
   * Updates fields in the document referred to by this `DocumentReference`.
   * The update will fail if applied to a document that does not exist.
   *
   * Nested fields can be updated by providing dot-separated field path
   * strings or by providing FieldPath objects.
   *
   * @param field The first field to update.
   * @param value The first value.
   * @param moreFieldsAndValues Additional key value pairs.
   * @return A Promise resolved once the data has been successfully written
   * to the backend (Note that it won't resolve while you're offline).
   */
  update(
    field: string | FieldPath,
    value: any,
    ...moreFieldsAndValues: any[]
  ): Promise<void>

  /**
   * Deletes the document referred to by this `DocumentReference`.
   *
   * @return A Promise resolved once the document has been successfully
   * deleted from the backend (Note that it won't resolve while you're
   * offline).
   */
  delete(): Promise<void>

  /**
   * Reads the document referred to by this `DocumentReference`.
   *
   * Note: get() attempts to provide up-to-date data when possible by waiting
   * for data from the server, but it may return cached data or fail if you
   * are offline and the server cannot be reached.
   *
   * @return A Promise resolved with a DocumentSnapshot containing the
   * current document contents.
   */
  get(): Promise<DocumentSnapshot<T>>

  /**
   * Attaches a listener for DocumentSnapshot events. You may either pass
   * individual `onNext` and `onError` callbacks or pass a single observer
   * object with `next` and `error` callbacks.
   *
   * NOTE: Although an `onCompletion` callback can be provided, it will
   * never be called because the snapshot stream is never-ending.
   *
   * @param options Options controlling the listen behavior.
   * @param onNext A callback to be called every time a new `DocumentSnapshot`
   * is available.
   * @param onError A callback to be called if the listen fails or is
   * cancelled. No further callbacks will occur.
   * @param observer A single object containing `next` and `error` callbacks.
   * @return An unsubscribe function that can be called to cancel
   * the snapshot listener.
   */
  onSnapshot(observer: {
    next?: (snapshot: DocumentSnapshot<T>) => void
    error?: (error: FirestoreError) => void
    complete?: () => void
  }): () => void
  onSnapshot(
    options: DocumentListenOptions,
    observer: {
      next?: (snapshot: DocumentSnapshot<T>) => void
      error?: (error: Error) => void
      complete?: () => void
    }
  ): () => void
  onSnapshot(
    onNext: (snapshot: DocumentSnapshot<T>) => void,
    onError?: (error: Error) => void,
    onCompletion?: () => void
  ): () => void
  onSnapshot(
    options: DocumentListenOptions,
    onNext: (snapshot: DocumentSnapshot<T>) => void,
    onError?: (error: Error) => void,
    onCompletion?: () => void
  ): () => void
}

/**
 * A `DocumentSnapshot` contains data read from a document in your Firestore
 * database. The data can be extracted with `.data()` or `.get(<field>)` to
 * get a specific field.
 *
 * For a `DocumentSnapshot` that points to a non-existing document, any data
 * access will return 'undefined'. You can use the `exists` property to
 * explicitly verify a document's existence.
 */
export declare class DocumentSnapshot<T> {
  protected constructor()

  /** True if the document exists. */
  readonly exists: boolean
  /** A `DocumentReference` to the document location. */
  readonly ref: DocumentReference<T>
  /**
   * The ID of the document for which this `DocumentSnapshot` contains data.
   */
  readonly id: string
  /**
   * Metadata about this snapshot, concerning its source and if it has local
   * modifications.
   */
  readonly metadata: SnapshotMetadata

  /**
   * Retrieves all fields in the document as an Object. Returns 'undefined' if
   * the document doesn't exist.
   *
   * By default, `FieldValue.serverTimestamp()` values that have not yet been
   * set to their final value will be returned as `null`. You can override
   * this by passing an options object.
   *
   * @param options An options object to configure how data is retrieved from
   * the snapshot (e.g. the desired behavior for server timestamps that have
   * not yet been set to their final value).
   * @return An Object containing all fields in the document or 'undefined' if
   * the document doesn't exist.
   */
  data(options?: SnapshotOptions): T | undefined

  /**
   * Retrieves the field specified by `fieldPath`. Returns 'undefined' if the
   * document or field doesn't exist.
   *
   * By default, a `FieldValue.serverTimestamp()` that has not yet been set to
   * its final value will be returned as `null`. You can override this by
   * passing an options object.
   *
   * @param fieldPath The path (e.g. 'foo' or 'foo.bar') to a specific field.
   * @param options An options object to configure how the field is retrieved
   * from the snapshot (e.g. the desired behavior for server timestamps that have
   * not yet been set to their final value).
   * @return The data at the specified field location or undefined if no such
   * field exists in the document.
   */
  get(fieldPath: string | FieldPath, options?: SnapshotOptions): any

  /**
   * Returns true if this `DocumentSnapshot` is equal to the provided one.
   *
   * @param other The `DocumentSnapshot` to compare against.
   * @return true if this `DocumentSnapshot` is equal to the provided one.
   */
  isEqual(other: DocumentSnapshot<T>): boolean
}

/**
 * A `QueryDocumentSnapshot` contains data read from a document in your
 * Firestore database as part of a query. The document is guaranteed to exist
 * and its data can be extracted with `.data()` or `.get(<field>)` to get a
 * specific field.
 *
 * A `QueryDocumentSnapshot` offers the same API surface as a
 * `DocumentSnapshot`. Since query results contain only existing documents, the
 * `exists` property will always be true and `data()` will never return
 * 'undefined'.
 */
export declare class QueryDocumentSnapshot<T> extends DocumentSnapshot<T> {
  private constructor()

  /**
   * Retrieves all fields in the document as an Object.
   *
   * By default, `FieldValue.serverTimestamp()` values that have not yet been
   * set to their final value will be returned as `null`. You can override
   * this by passing an options object.
   *
   * @override
   * @param options An options object to configure how data is retrieved from
   * the snapshot (e.g. the desired behavior for server timestamps that have
   * not yet been set to their final value).
   * @return An Object containing all fields in the document.
   */
  data(options?: SnapshotOptions): T
}

/**
 * A `QuerySnapshot` contains zero or more `DocumentSnapshot` objects
 * representing the results of a query. The documents can be accessed as an
 * array via the `docs` property or enumerated using the `forEach` method. The
 * number of documents can be determined via the `empty` and `size`
 * properties.
 */
export declare class QuerySnapshot<T> {
  private constructor()

  /**
   * The query on which you called `get` or `onSnapshot` in order to get this
   * `QuerySnapshot`.
   */
  readonly query: Query<T>
  /**
   * Metadata about this snapshot, concerning its source and if it has local
   * modifications.
   */
  readonly metadata: SnapshotMetadata
  /**
   * An array of the documents that changed since the last snapshot. If this
   * is the first snapshot, all documents will be in the list as added
   * changes.
   */
  readonly docChanges: DocumentChange[]

  /** An array of all the documents in the QuerySnapshot. */
  readonly docs: QueryDocumentSnapshot<T>[]

  /** The number of documents in the QuerySnapshot. */
  readonly size: number

  /** True if there are no documents in the QuerySnapshot. */
  readonly empty: boolean

  /**
   * Enumerates all of the documents in the QuerySnapshot.
   *
   * @param callback A callback to be called with a `QueryDocumentSnapshot` for
   * each document in the snapshot.
   * @param thisArg The `this` binding for the callback.
   */
  forEach(
    callback: (result: QueryDocumentSnapshot<T>) => void,
    thisArg?: any
  ): void

  /**
   * Returns true if this `QuerySnapshot` is equal to the provided one.
   *
   * @param other The `QuerySnapshot` to compare against.
   * @return true if this `QuerySnapshot` is equal to the provided one.
   */
  isEqual(other: QuerySnapshot<T>): boolean
}

/**
 * A `Query` refers to a Query which you can read or listen to. You can also
 * construct refined `Query` objects by adding filters and ordering.
 */
export declare class Query<T> {
  protected constructor()

  /**
   * The `Firestore` for the Firestore database (useful for performing
   * transactions, etc.).
   */
  readonly firestore: Firestore

  /**
   * Creates and returns a new Query with the additional filter that documents
   * must contain the specified field and the value should satisfy the
   * relation constraint provided.
   *
   * @param fieldPath The path to compare
   * @param opStr The operation string (e.g "<", "<=", "==", ">", ">=").
   * @param value The value for comparison
   * @return The created Query.
   */
  where(
    fieldPath: string | FieldPath,
    opStr: WhereFilterOp,
    value: any
  ): Query<T>

  /**
   * Creates and returns a new Query that's additionally sorted by the
   * specified field, optionally in descending order instead of ascending.
   *
   * @param fieldPath The field to sort by.
   * @param directionStr Optional direction to sort by ('asc' or 'desc'). If
   * not specified, order will be ascending.
   * @return The created Query.
   */
  orderBy(
    fieldPath: string | FieldPath,
    directionStr?: OrderByDirection
  ): Query<T>

  /**
   * Creates and returns a new Query that's additionally limited to only
   * return up to the specified number of documents.
   *
   * @param limit The maximum number of items to return.
   * @return The created Query.
   */
  limit(limit: number): Query<T>

  /**
   * Creates and returns a new Query that starts at the provided document
   * (inclusive). The starting position is relative to the order of the query.
   * The document must contain all of the fields provided in the orderBy of
   * this query.
   *
   * @param snapshot The snapshot of the document to start at.
   * @return The created Query.
   */
  startAt(snapshot: DocumentSnapshot<T>): Query<T>

  /**
   * Creates and returns a new Query that starts at the provided fields
   * relative to the order of the query. The order of the field values
   * must match the order of the order by clauses of the query.
   *
   * @param fieldValues The field values to start this query at, in order
   * of the query's order by.
   * @return The created Query.
   */
  startAt(...fieldValues: any[]): Query<T>

  /**
   * Creates and returns a new Query that starts after the provided document
   * (exclusive). The starting position is relative to the order of the query.
   * The document must contain all of the fields provided in the orderBy of
   * this query.
   *
   * @param snapshot The snapshot of the document to start after.
   * @return The created Query.
   */
  startAfter(snapshot: DocumentSnapshot<T>): Query<T>

  /**
   * Creates and returns a new Query that starts after the provided fields
   * relative to the order of the query. The order of the field values
   * must match the order of the order by clauses of the query.
   *
   * @param fieldValues The field values to start this query after, in order
   * of the query's order by.
   * @return The created Query.
   */
  startAfter(...fieldValues: any[]): Query<T>

  /**
   * Creates and returns a new Query that ends before the provided document
   * (exclusive). The end position is relative to the order of the query. The
   * document must contain all of the fields provided in the orderBy of this
   * query.
   *
   * @param snapshot The snapshot of the document to end before.
   * @return The created Query.
   */
  endBefore(snapshot: DocumentSnapshot<T>): Query<T>

  /**
   * Creates and returns a new Query that ends before the provided fields
   * relative to the order of the query. The order of the field values
   * must match the order of the order by clauses of the query.
   *
   * @param fieldValues The field values to end this query before, in order
   * of the query's order by.
   * @return The created Query.
   */
  endBefore(...fieldValues: any[]): Query<T>

  /**
   * Creates and returns a new Query that ends at the provided document
   * (inclusive). The end position is relative to the order of the query. The
   * document must contain all of the fields provided in the orderBy of this
   * query.
   *
   * @param snapshot The snapshot of the document to end at.
   * @return The created Query.
   */
  endAt(snapshot: DocumentSnapshot<T>): Query<T>

  /**
   * Creates and returns a new Query that ends at the provided fields
   * relative to the order of the query. The order of the field values
   * must match the order of the order by clauses of the query.
   *
   * @param fieldValues The field values to end this query at, in order
   * of the query's order by.
   * @return The created Query.
   */
  endAt(...fieldValues: any[]): Query<T>

  /**
   * Returns true if this `Query` is equal to the provided one.
   *
   * @param other The `Query` to compare against.
   * @return true if this `Query` is equal to the provided one.
   */
  isEqual(other: Query<T>): boolean

  /**
   * Executes the query and returns the results as a QuerySnapshot.
   *
   * @return A Promise that will be resolved with the results of the Query.
   */
  get(): Promise<QuerySnapshot<T>>

  /**
   * Attaches a listener for QuerySnapshot events. You may either pass
   * individual `onNext` and `onError` callbacks or pass a single observer
   * object with `next` and `error` callbacks.
   *
   * NOTE: Although an `onCompletion` callback can be provided, it will
   * never be called because the snapshot stream is never-ending.
   *
   * @param options Options controlling the listen behavior.
   * @param onNext A callback to be called every time a new `QuerySnapshot`
   * is available.
   * @param onError A callback to be called if the listen fails or is
   * cancelled. No further callbacks will occur.
   * @param observer A single object containing `next` and `error` callbacks.
   * @return An unsubscribe function that can be called to cancel
   * the snapshot listener.
   */
  onSnapshot(observer: {
    next?: (snapshot: QuerySnapshot<T>) => void
    error?: (error: Error) => void
    complete?: () => void
  }): () => void
  onSnapshot(
    options: QueryListenOptions,
    observer: {
      next?: (snapshot: QuerySnapshot<T>) => void
      error?: (error: Error) => void
      complete?: () => void
    }
  ): () => void
  onSnapshot(
    onNext: (snapshot: QuerySnapshot<T>) => void,
    onError?: (error: Error) => void,
    onCompletion?: () => void
  ): () => void
  onSnapshot(
    options: QueryListenOptions,
    onNext: (snapshot: QuerySnapshot<T>) => void,
    onError?: (error: Error) => void,
    onCompletion?: () => void
  ): () => void
}

/**
 * A `CollectionReference` object can be used for adding documents, getting
 * document references, and querying for documents (using the methods
 * inherited from `Query`).
 */
export declare class CollectionReference<T> extends Query<T> {
  private constructor()

  /** The identifier of the collection. */
  readonly id: string

  /**
   * A reference to the containing Document if this is a subcollection, else
   * null.
   */
  readonly parent: DocumentReference<T> | null

  /**
   * A string representing the path of the referenced collection (relative
   * to the root of the database).
   */
  readonly path: string

  /**
   * Get a `DocumentReference` for the document within the collection at the
   * specified path. If no path is specified, an automatically-generated
   * unique ID will be used for the returned DocumentReference.
   *
   * @param documentPath A slash-separated path to a document.
   * @return The `DocumentReference` instance.
   */
  doc(documentPath?: string): DocumentReference<T>

  /**
   * Add a new document to this collection with the specified data, assigning
   * it a document ID automatically.
   *
   * @param data An Object containing the data for the new document.
   * @return A Promise resolved with a `DocumentReference` pointing to the
   * newly created document after it has been written to the backend.
   */
  add(data: T): Promise<DocumentReference<T>>

  /**
   * Returns true if this `CollectionReference` is equal to the provided one.
   *
   * @param other The `CollectionReference` to compare against.
   * @return true if this `CollectionReference` is equal to the provided one.
   */
  isEqual(other: CollectionReference<T>): boolean
  
  /**
   * Get a `DocumentReference` for the document within the collection at the
   * specified path. If no path is specified, an automatically-generated
   * unique ID will be used for the returned DocumentReference.
   *
   * @param documentPath A slash-separated path to a document.
   * @return The `DocumentReference` instance.
   */
  doc(documentPath?: string): DocumentReference<T>
  
  /**
   * Add a new document to this collection with the specified data, assigning
   * it a document ID automatically.
   *
   * @param data An Object containing the data for the new document.
   * @return A Promise resolved with a `DocumentReference` pointing to the
   * newly created document after it has been written to the backend.
   */
  add(data: T): Promise<DocumentReference<T>>
}
