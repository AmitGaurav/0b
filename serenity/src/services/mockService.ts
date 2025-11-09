import { AxiosResponse } from 'axios';

class MockService {
  private static delay = 500; // Simulate network delay

  static async mockResponse<T>(data: T): Promise<AxiosResponse<T>> {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    return {
      data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    } as AxiosResponse<T>;
  }

  static async mockError(status: number, message: string): Promise<never> {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    throw {
      response: {
        status,
        data: { message }
      }
    };
  }
}

export default MockService;