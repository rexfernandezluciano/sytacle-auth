/** @format */

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
        toBeNull() {
            if (actual !== null) {
                throw new Error(`Expected null but got ${actual}`);
            }
        }
    };
}

class MockTokenManager {
    private token: string | null = null;
    private expiresAt: number | null = null;

    setToken(accessToken: string, expiresIn?: number): void {
        this.token = accessToken;
        if (expiresIn) {
            this.expiresAt = Date.now() + expiresIn * 1000;
        }
    }

    getToken(): string | null {
        if (this.token && this.isExpired()) {
            this.clearToken();
            return null;
        }
        return this.token;
    }

    clearToken(): void {
        this.token = null;
        this.expiresAt = null;
    }

    isAuthenticated(): boolean {
        return this.getToken() !== null;
    }

    private isExpired(): boolean {
        if (!this.expiresAt) return false;
        return Date.now() >= this.expiresAt;
    }
}

console.log("\n=== TokenManager Tests ===\n");

test("TokenManager should start with no token", () => {
    const manager = new MockTokenManager();
    expect(manager.getToken()).toBeNull();
});

test("TokenManager should not be authenticated initially", () => {
    const manager = new MockTokenManager();
    expect(manager.isAuthenticated()).toBeFalsy();
});

test("TokenManager should store and retrieve token", () => {
    const manager = new MockTokenManager();
    manager.setToken("test-token-123");
    expect(manager.getToken()).toBe("test-token-123");
});

test("TokenManager should be authenticated after setting token", () => {
    const manager = new MockTokenManager();
    manager.setToken("test-token");
    expect(manager.isAuthenticated()).toBeTruthy();
});

test("TokenManager should clear token", () => {
    const manager = new MockTokenManager();
    manager.setToken("test-token");
    manager.clearToken();
    expect(manager.getToken()).toBeNull();
});

test("TokenManager should not be authenticated after clearing token", () => {
    const manager = new MockTokenManager();
    manager.setToken("test-token");
    manager.clearToken();
    expect(manager.isAuthenticated()).toBeFalsy();
});

test("TokenManager should handle token expiration", () => {
    const manager = new MockTokenManager();
    manager.setToken("expiring-token", -1);
    expect(manager.getToken()).toBeNull();
});

test("TokenManager should keep non-expired token", () => {
    const manager = new MockTokenManager();
    manager.setToken("valid-token", 3600);
    expect(manager.getToken()).toBe("valid-token");
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
