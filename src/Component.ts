import 'reflect-metadata'

interface Constructable<T = any> {
    new(...params: any[]): T;
}

const componentsContainer = new Map<string, any>()
const registeredComponents = new Map<string, Constructable>()

function Component(originalConstructor: Constructable): Constructable {

    registerComponent(originalConstructor)

    return new Proxy(
        originalConstructor,
        {
            construct(target: Constructable): Constructable {
                return getInstance(target)
            }
        }
    );
}

function registerComponent(component: Constructable) {
    registeredComponents.set(component.name, component)
}

function getDependencies(component: Constructable) {
    const metaData = Reflect.getMetadata('design:paramtypes', component) || []
    const dependencies = metaData.map((param: any) => getInstance(param))
    return dependencies
}

function getInstance(constructor: Constructable) {
    const component = registeredComponents.get(constructor.name)
    if (!component) return null
    let obj = componentsContainer.get(component.name)
    if (!obj) {
        const dependencies = getDependencies(component)
        obj = Reflect.construct(component, dependencies);
        componentsContainer.set(component.name, obj)
    }
    return obj
}

export default Component