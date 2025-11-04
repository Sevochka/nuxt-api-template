import type { $Fetch } from 'ofetch';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

class HttpFactory {
  private readonly $fetch: $Fetch;

  constructor(fetcher: $Fetch) {
    this.$fetch = fetcher;
  }

  static getUrl(resource: string, slug: string): string {
    return `${resource}/${slug}`;
  }

  static getParamsKey(method: Method): string {
    return method === 'GET' ? 'params' : 'body';
  }

  /**
   * method - GET, POST, PUT
   * URL
   **/
  async call<T>(
    method: Method,
    slug: string,
    data?: object,
    extras = {},
  ): Promise<T> {
    const url = slug.endsWith('/') ? slug : slug + '/';
    const $res: T = await this.$fetch(url, {
      method,
      [HttpFactory.getParamsKey(method)]: data,
      ...extras,
      headers: {
        ...useRequestHeaders(['cookie']),
      },
    });
    return $res;
  }
}

export default HttpFactory;
