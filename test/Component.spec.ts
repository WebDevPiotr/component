import Component from '../src/Component'

@Component
class SecondLevelChild {
    sayMyName() { return 'SecondLevelChild' }
}

@Component
class Child {
    constructor(private secondLevelChild?: SecondLevelChild) { }
    public sayMyName() { return 'Child' }
    public sayChildName() { return this.secondLevelChild.sayMyName() }
}

@Component
class AnotherChild {
    public sayMyName() { return 'AnotherChild' }
}

class NonInjectableChild {
    public sayMyName() { return 'NonInjectableChild' }
}

@Component
class Container {
    constructor(public child?: Child, private anotherChild?: AnotherChild, public nonInjectableChild?: NonInjectableChild) { }
    public sayChildName() { return this.child.sayMyName() }
    public sayAnotherChildName() { return this.anotherChild.sayMyName() }
}


describe('Di should work', () => {

    test('it should create object', () => {
        let object = new Container();
        expect(object).not.toBe(undefined);
    });
    test('it should create singleton', () => {
        let object1 = new Container();
        let object2 = new Container();
        expect(object1).toBe(object2);
    });
    test('it should be able to inject a dependable class', () => {
        let object = new Container();
        expect(object.sayChildName()).toEqual('Child');
        expect(object.sayAnotherChildName()).toEqual('AnotherChild');
    });

    test('it should be able to inject a dependable class with a dependable class (2 levels down)', () => {
        let object = new Container();
        expect(object.child.sayMyName()).toBe('Child');
        expect(object.child.sayChildName()).toBe('SecondLevelChild');
    });

    test('it should be able to ignore non injectable dependencies', () => {
        let object = new Container();
        expect(object.nonInjectableChild).toBe(null);
    });

})