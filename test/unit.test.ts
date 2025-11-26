/** @format */

import { SytacleAuth } from "../src/provider/SytacleAuth";

interface TestResult {
    name: string;
    passed: boolean;
    error?: string;
}

const results: TestResult[] = [];

function test(name: string, fn: () => void) {
    try {
        fn();
        results.push({ name, passed: true });
        console.log(`✓ ${name}`);
    } catch (error: any) {
        results.push({ name, passed: false, error: error.message });
        console.log(`✗ ${name}: ${error.message}`);
    }
}

function expect<T>(actual: T) {
    return {
        toBe(expected: T) {
            if (actual !== expected) {
                throw new Error(`Expected ${expected} but got ${actual}`);
            }
        },
        toContain(substring: string) {
            if (typeof actual !== "string" || !actual.includes(substring)) {
                throw new Error(`Expected "${actual}" to contain "${substring}"`);
            }
        },
        toBeTruthy() {
            if (!actual) {
                throw new Error(`Expected ${actual} to be truthy`);
            }
        },
        toBeFalsy() {
            if (actual) {
                throw new Error(`Expected ${actual} to be falsy`);
            }
        },
        toBeInstanceOf(constructor: any) {
            if (!(actual instanceof constructor)) {
                throw new Error(`Expected instance of ${constructor.name}`);
            }
        }
    };
}

const TEST_URL = "https://example.com/callback";

console.log("\n=== SytacleAuth Tests ===\n");

test("SytacleAuth should create instance with required options", () => {
    const auth = new SytacleAuth({ id: "test-client", url: TEST_URL });
    expect(auth).toBeTruthy();
});

test("SytacleAuth should have correct origin", () => {
    const auth = new SytacleAuth({ id: "test-client", url: TEST_URL });
    expect(auth.getOrigin()).toBe("https://accounts.sytacle.com");
});

test("SytacleAuth getAuthUrl should contain client_id", () => {
    const auth = new SytacleAuth({ id: "my-app-123", url: TEST_URL });
    const url = auth.getAuthUrl();
    expect(url).toContain("client_id=my-app-123");
});

test("SytacleAuth getAuthUrl should contain response_type=code", () => {
    const auth = new SytacleAuth({ id: "test", url: TEST_URL });
    const url = auth.getAuthUrl();
    expect(url).toContain("response_type=code");
});

test("SytacleAuth getAuthUrl should include scopes", () => {
    const auth = new SytacleAuth({
        id: "test",
        scopes: ["profile", "email"],
        url: TEST_URL
    });
    const url = auth.getAuthUrl();
    expect(url).toContain("scope=profile+email");
});

test("SytacleAuth getChooserUrl should contain app id", () => {
    const auth = new SytacleAuth({ id: "my-app-456", url: TEST_URL });
    const url = auth.getChooserUrl();
    expect(url).toContain("id=my-app-456");
});

test("SytacleAuth getLoginUrl with chooser=false returns auth URL", () => {
    const auth = new SytacleAuth({ id: "test", chooser: false, url: TEST_URL });
    const url = auth.getLoginUrl();
    expect(url).toContain("accounts.sytacle.com/authorize");
});

test("SytacleAuth getLoginUrl with chooser=true returns chooser URL", () => {
    const auth = new SytacleAuth({ id: "test", chooser: true, url: TEST_URL });
    const url = auth.getLoginUrl();
    expect(url).toContain("accounts.sytacle.com/chooser");
});

test("SytacleAuth should include state parameter for CSRF protection", () => {
    const auth = new SytacleAuth({ id: "test", url: TEST_URL });
    const url = auth.getAuthUrl();
    expect(url).toContain("state=");
});

test("SytacleAuth should use default scopes when not provided", () => {
    const auth = new SytacleAuth({ id: "test", url: TEST_URL });
    const url = auth.getAuthUrl();
    expect(url).toContain("scope=profile");
});

test("SytacleAuth should include redirect_uri in auth URL", () => {
    const auth = new SytacleAuth({ id: "test", url: TEST_URL });
    const url = auth.getAuthUrl();
    expect(url).toContain("redirect_uri=https%3A%2F%2Fexample.com%2Fcallback");
});

test("SytacleAuth should include signin_flow in chooser URL", () => {
    const auth = new SytacleAuth({ id: "test", url: TEST_URL, signInFlow: "popup" });
    const url = auth.getChooserUrl();
    expect(url).toContain("signin_flow=popup");
});

test("SytacleAuth getState should return the generated state", () => {
    const auth = new SytacleAuth({ id: "test", url: TEST_URL });
    const state = auth.getState();
    expect(state).toBeTruthy();
});

test("SytacleAuth verifyState should return true for matching state", () => {
    const auth = new SytacleAuth({ id: "test", url: TEST_URL });
    const state = auth.getState();
    expect(auth.verifyState(state)).toBe(true);
});

test("SytacleAuth verifyState should return false for non-matching state", () => {
    const auth = new SytacleAuth({ id: "test", url: TEST_URL });
    expect(auth.verifyState("wrong-state")).toBe(false);
});

test("SytacleAuth should generate unique state for each instance", () => {
    const auth1 = new SytacleAuth({ id: "test", url: TEST_URL });
    const auth2 = new SytacleAuth({ id: "test", url: TEST_URL });
    const state1 = auth1.getState();
    const state2 = auth2.getState();
    expect(state1 === state2).toBeFalsy();
});

console.log("\n=== Test Summary ===\n");
const passed = results.filter((r) => r.passed).length;
const failed = results.filter((r) => !r.passed).length;
console.log(`Passed: ${passed}/${results.length}`);
console.log(`Failed: ${failed}/${results.length}`);

if (failed > 0) {
    console.log("\nFailed tests:");
    results
        .filter((r) => !r.passed)
        .forEach((r) => {
            console.log(`  - ${r.name}: ${r.error}`);
        });
    process.exit(1);
}

console.log("\nAll tests passed!\n");
