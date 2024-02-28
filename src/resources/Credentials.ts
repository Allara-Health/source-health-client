import { Resource } from '../BaseResource'
import { SourceRequestOptions } from '../SourceClient'

export enum CredentialStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export type CredentialsListParamsSort = 'created_at' | 'payer_id' | '-created_at' | '-payer_id'

export interface Credential {
  object: 'credential'
  /**
   * The unique identifier for the credential.
   */
  id: `crd_${string}`

  payer_id: `pyr_${string}`

  user_id: `usr_${string}`

  /**
   * The effective date for the credential.
   */
  effective_date: string

  /**
   * Description for this credential
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
   * Timestamp when the credential was deleted, which is only present for deleted credentials.
   * Deleted credentials are not typically returned by the API, however they are returned in
   * `credential.deleted` events and expanded references on other objects.
   */
  deleted_at?: string
}

export interface CredentialListResponse {
  object: 'list'
  data: Array<Credential>
  has_more: boolean
}

export interface CredentialListParams {
  user: string
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
  sort?: CredentialsListParamsSort

  /*
   * Limit results to credentials with region matching the given query.
   */
  region?: string

  /*
   * Limit results to credentials with payer matching the given query.
   */
  payer?: string
  /**
   * Filter credentials to only those whose archive status matches the provided value. By
   * default, this operation return all credentials. You may pass `archived=true` to show
   * archived credentials, or `archived=false` to show unarchived credentials.
   */
  archived?: boolean
}

export interface CredentialCreateParams {
  payer_id: string
  user_id: string
  region: string
  effective_date: string
  description?: string | null
}

export interface CredentialUpdateParams {
  effective_date?: string | null
}

export class CredentialResource extends Resource {
  /**
   * Returns a list of credentials within the current account. The credentials returned are sorted
   * by creation date, with the most recently added credential appearing first.
   */
  public list(
    params?: CredentialListParams,
    options?: SourceRequestOptions,
  ): Promise<CredentialListResponse> {
    return this.source.request('GET', '/v1/credentials', {
      query: params,
      options,
    })
  }

  /**
   * Creates a new credential. You can create a new credential with a unique name and a display
   * color of your choice. If a credential already exists with the same name (case
   * insensitive), an error is returned.
   */
  public create(
    params: CredentialCreateParams,
    options?: SourceRequestOptions,
  ): Promise<Credential> {
    return this.source.request('POST', '/v1/credentials', {
      data: params,
      contentType: 'json',
      options,
    })
  }

  /**
   * Retrieve a credential by its unique identifier.
   */
  public retrieve(id: string, options?: SourceRequestOptions): Promise<Credential> {
    return this.source.request('GET', `/v1/credentials/${id}`, {
      options,
    })
  }

  /**
   * Updates the specified credential by setting the values of the parameters passed. Any
   * parameters not provided will be left unchanged.
   */
  public update(
    id: string,
    params?: CredentialUpdateParams,
    options?: SourceRequestOptions,
  ): Promise<Credential> {
    return this.source.request('POST', `/v1/credentials/${id}`, {
      data: params,
      contentType: 'json',
      options,
    })
  }

  /**
   * Deletes the specified credential. A deleted credential is removed from all members to which it
   * relates.
   */
  public delete(id: string, options?: SourceRequestOptions): Promise<Credential> {
    return this.source.request('DELETE', `/v1/credentials/${id}`, {
      contentType: 'json',
      options,
    })
  }
}
