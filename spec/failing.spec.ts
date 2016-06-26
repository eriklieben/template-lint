"use strict";

import {Linter, Rule} from 'template-lint';
import {Config} from '../source/config';
import {AureliaLinter} from '../source/aurelia-linter';
import {Reflection} from '../source/reflection';
import {StaticTypeRule} from '../source/rules/static-type';

import {initialize} from 'aurelia-pal-nodejs';

initialize();

describe("Failing Scenarios", () => {
    //uncomment, add your example and what you expect. 
    /*it("some test that fails", (done) => {
        var config: Config = new Config();
        var linter: AureliaLinter = new AureliaLinter(config);
        var html = `<template></etemps> <!-- oops! -->`
        linter.lint(html)
            .then((issues) => {                   
                expect(issues.length).toBe(0);
                done();
            });
    });*/
});