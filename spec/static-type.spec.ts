import {Linter, Rule} from 'template-lint';
import {Reflection} from '../source/reflection';
import {StaticTypeRule} from '../source/rules/static-type';
import {ViewResources} from 'aurelia-templating';
import {TemplatingBindingLanguage, SyntaxInterpreter, AttributeMap} from 'aurelia-templating-binding';
import {Parser, ObserverLocator, NameExpression, bindingMode} from 'aurelia-binding';
import fs = require('fs');
import {initialize} from 'aurelia-pal-nodejs';

initialize();

describe("StaticType Rule", () => {
  it("accepts good attribute binding", (done) => {
    let viewmodel = `
    export class Foo{
      name:string
    }`
    let view = `
    <template>
      \${name}
    </template>`
    let reflection = new Reflection();
    let rule = new StaticTypeRule(reflection);
    let linter = new Linter([rule]);
    reflection.add("./foo.ts", viewmodel);
    linter.lint(view, "./foo.html")
      .then((issues) => {
        try {
          expect(issues.length).toBe(0);
        } finally { done(); }
      })
  });

  it("rejects bad attribute binding", (done) => {
    let viewmodel = `
    export class Foo{
      name:string
    }`
    let view = `
    <template>
      \${nam}
    </template>`
    let reflection = new Reflection();
    let rule = new StaticTypeRule(reflection);
    let linter = new Linter([rule]);
    reflection.add("./foo.ts", viewmodel);
    linter.lint(view, "./foo.html")
      .then((issues) => {
        try {
          expect(issues.length).toBe(1)
          expect(issues[0].message).toBe("cannot find 'nam' in type 'Foo'");
        } finally { done(); }
      })
  });

  it("accepts good attribute binding to imported type", (done) => {
    let item = `
    export class Item{
      info:string;
    }`;

    let viewmodel = `
    import {Item} from './path/item
    export class Foo{
      item:Item
    }`
    let view = `
    <template>
      \${item.info}
    </template>`
    let reflection = new Reflection();
    let rule = new StaticTypeRule(reflection);
    let linter = new Linter([rule]);
    reflection.add("./foo.ts", viewmodel);
    reflection.add("./path/item.ts", item);
    linter.lint(view, "./foo.html")
      .then((issues) => {
        try {
          expect(issues.length).toBe(0);
        } finally { done(); }
      })
  });

  it("rejects bad attribute binding to imported type", (done) => {
    let item = `
    export class Item{
      info:string;
    }`;
    let viewmodel = `
    import {Item} from './path/item
    export class Foo{
      item:Item
    }`;
    let view = `
    <template>
      \${item.infooo}
    </template>`
    let reflection = new Reflection();
    let rule = new StaticTypeRule(reflection);
    let linter = new Linter([rule]);
    reflection.add("./foo.ts", viewmodel);
    reflection.add("./path/item.ts", item);
    linter.lint(view, "./foo.html")
      .then((issues) => {
        try {
          expect(issues.length).toBe(1);
          expect(issues[0].message).toBe("cannot find 'infooo' in type 'Item'");
        } finally { done(); }
      })
  });

  it("accepts good with.bind attribute value", (done) => {
    let item = `
    export class Item{
      info:string;
    }`;

    let viewmodel = `
    import {Item} from './path/item
    export class Foo{
      item:Item
    }`
    let view = `
    <template with.bind="item"></template>`
    let reflection = new Reflection();
    let rule = new StaticTypeRule(reflection);
    let linter = new Linter([rule]);
    reflection.add("./foo.ts", viewmodel);
    reflection.add("./path/item.ts", item);
    linter.lint(view, "./foo.html")
      .then((issues) => {
        try {
          expect(issues.length).toBe(0);
        } finally { done(); }
      })
  });

  it("rejects bad with.bind attribute value", (done) => {
    let item = `
    export class Item{
      info:string;
    }`;

    let viewmodel = `
    import {Item} from './path/item
    export class Foo{
      item:Item
    }`
    let view = `
    <template with.bind="itm"></template>`
    let reflection = new Reflection();
    let rule = new StaticTypeRule(reflection);
    let linter = new Linter([rule]);
    reflection.add("./foo.ts", viewmodel);
    reflection.add("./path/item.ts", item);
    linter.lint(view, "./foo.html")
      .then((issues) => {
        try {
          expect(issues.length).toBe(1);
          expect(issues[0].message).toBe("cannot find 'itm' in type 'Foo'");
        } finally { done(); }
      })
  });

  it("accepts good repeat.for attribute value", (done) => {
    let item = `
    export class Item{
      info:string;
    }`;

    let viewmodel = `
    import {Item} from './path/item
    export class Foo{
      items:Item[]
    }`
    let view = `
    <template repeat.for="item of items">    
      \${item}
    </template>`
    let reflection = new Reflection();
    let rule = new StaticTypeRule(reflection);
    let linter = new Linter([rule]);
    reflection.add("./foo.ts", viewmodel);
    reflection.add("./path/item.ts", item);
    linter.lint(view, "./foo.html")
      .then((issues) => {
        try {
          expect(issues.length).toBe(0);
        } finally { done(); }
      })
  });

  it("accepts good repeat.for attribute valid of imported interface", (done) => {
    let item = `
    export interface Item{
      info:string;
    }`;

    let viewmodel = `
    import {Item} from './path/item
    export class Foo{
      items:Item[]
    }`
    let view = `
    <template repeat.for="item of items">
      \${item}
      \${item.info}
    </template>`
    let reflection = new Reflection();
    let rule = new StaticTypeRule(reflection);
    let linter = new Linter([rule]);
    reflection.add("./foo.ts", viewmodel);
    reflection.add("./path/item.ts", item);
    linter.lint(view, "./foo.html")
      .then((issues) => {
        try {
          expect(issues.length).toBe(0);
        } finally { done(); }
      })
  });

  it("rejects bad with.bind attribute value", (done) => {
    let item = `
    export class Item{
      info:string;
    }`;

    let viewmodel = `
    import {item} from './path/item
    export class Foo{
      items:Item
    }`
    let view = `
    <template repeat.for="item of itms"></template>`
    let reflection = new Reflection();
    let rule = new StaticTypeRule(reflection);
    let linter = new Linter([rule]);
    reflection.add("./foo.ts", viewmodel);
    reflection.add("./path/item.ts", item);
    linter.lint(view, "./foo.html")
      .then((issues) => {
        try {
          expect(issues.length).toBe(1);
          expect(issues[0].message).toBe("cannot find 'itms' in type 'Foo'");
        } finally { done(); }
      })
  });
});