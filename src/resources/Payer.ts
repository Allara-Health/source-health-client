import { Resource } from '../BaseResource'
import { SourceRequestOptions } from '../SourceClient'

export enum PayerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export type PayersListParamsSort = 'created_at' | 'name' | '-created_at' | '-name'

export interface Payer {
  object: 'payer'
  /**
   * The unique identifier for the payer.
   */
  id: `pyr_${string}`
  /**
   * The name for the payer.
   */
  name: string
  /**
   * The effective date for the payer.
   */
  effective_date: string
  /**
   * The status of the payer.
   */
  status: PayerStatus
  /**
   * Description for this payer
   */
  description?: string | null
  /**
   * Timestamp of when the member was created.
   */
  created_at: string
  /**
   * Timestamp of when the member was last updated.
   */
  updated_at: string

  /**
   * Timestamp when the payer was deleted, which is only present for deleted payers.
   * Deleted payers are not typically returned by the API, however they are returned in
   * `payer.deleted` events and expanded references on other objects.
   */
  deleted_at?: string
}

export interface PayerListResponse {
  object: 'list'
  data: Array<Payer>
  has_more: boolean
}

export interface PayerListParams {
  /**
   * A cursor for use in pagination. `ending_before` is an object ID that defines
   * your place in the list. For instance, if you make a list request and receive 100
   * objects, starting with obj_bar, your subsequent call can include
   * ending_before=obj_bar in order to fetch the previous page of the list.
   */
  ending_before?: string
  /**
   * A cursor for use in pagination. `starting_after` is an object ID that defines
   * your place in the list. For instance, if you make a list request and receive 100
   * objects, ending with obj_foo, your subsequent call can include
   * starting_after=obj_foo in order to fetch the next page of the list.
   */
  starting_after?: string
  /**
   * A limit on the number of objects to be returned. Limit can range between 1 and
   * 100.
   */
  limit?: number
  /**
   * Sort field for the results. A '-' prefix indicates sorting by that field in
   * descending order, otherwise the order will be ascending.
   */
  sort?: PayersListParamsSort
  /**
   * Filter results by payers matching the provided name. This parameter is case
   * insensitive.
   */
  name?: string
  /**
   * Filter payers to only those whose archive status matches the provided value. By
   * default, this operation return all payers. You may pass `archived=true` to show
   * archived payers, or `archived=false` to show unarchived payers.
   */
  archived?: boolean
}

export interface PayerCreateParams {
  /**
   * The name for the payer.
   */
  name: string
  /**
   * The effective date for the payer.
   */
  effective_date: string
  /**
   * Description for this payer. The description is not displayed and is used to
   * capture administrative notes about the payer.
   */
  description: string
  /**
   * The status of the payer.
   */
  status: PayerStatus
}

export interface PayerUpdateParams {
  /**
   * Unique name of the payer that is used for display. Must not start with payer_
   */
  name?: string
  /**
   * Description for this payer. The description is not displayed and is used to
   * capture administrative notes about the payer.
   */
  description?: string | null

  /**
   * The status of the payer.
   */
  status?: PayerStatus

  /**
   * The effective date for the payer.
   * **/
  effective_date?: string | null
}

export class PayerResource extends Resource {
  /**
   * Returns a list of payers within the current account. The payers returned are sorted
   * by creation date, with the most recently added payer appearing first.
   */
  public list(
    params?: PayerListParams,
    options?: SourceRequestOptions,
  ): Promise<PayerListResponse> {
    return this.source.request('GET', '/v1/payers', {
      query: params,
      options,
    })
  }

  /**
   * Creates a new payer. You can create a new payer with a unique name and a display
   * color of your choice. If a payer already exists with the same name (case
   * insensitive), an error is returned.
   */
  public create(params: PayerCreateParams, options?: SourceRequestOptions): Promise<Payer> {
    return this.source.request('POST', '/v1/payers', {
      data: params,
      contentType: 'json',
      options,
    })
  }

  /**
   * Retrieve a payer by its unique identifier.
   */
  public retrieve(id: string, options?: SourceRequestOptions): Promise<Payer> {
    return this.source.request('GET', `/v1/payers/${id}`, {
      options,
    })
  }

  /**
   * Updates the specified payer by setting the values of the parameters passed. Any
   * parameters not provided will be left unchanged.
   */
  public update(
    id: string,
    params?: PayerUpdateParams,
    options?: SourceRequestOptions,
  ): Promise<Payer> {
    return this.source.request('POST', `/v1/payers/${id}`, {
      data: params,
      contentType: 'json',
      options,
    })
  }

  /**
   * Deletes the specified payer. A deleted payer is removed from all members to which it
   * relates.
   */
  public delete(id: string, options?: SourceRequestOptions): Promise<Payer> {
    return this.source.request('DELETE', `/v1/payers/${id}`, {
      contentType: 'json',
      options,
    })
  }
}
