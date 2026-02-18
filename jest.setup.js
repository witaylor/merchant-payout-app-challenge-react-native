import { server } from "./mocks/server.jest";

// Use fake timers to prevent React Query / MSW timers from keeping Jest alive
jest.useFakeTimers({ legacyFakeTimers: false });

// Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

// Reset any request handlers that are declared as a part of our tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());
