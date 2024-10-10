describe('Setup Verification', () => {
    it('should pass a basic truthy test', () => {
        expect(true).toBe(true);
    });

    it('should transpile TypeScript correctly', () => {
        const add = (a: number, b: number): number => a + b;
        expect(add(2, 3)).toBe(5);
    });
});
