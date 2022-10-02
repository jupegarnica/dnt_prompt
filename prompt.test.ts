import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { stub } from "https://deno.land/std/testing/mock.ts";
import { promptObj } from "./prompt_object.ts";

Deno.test("promptObj should work with basic primitives", () => {
    const prompt = stub(globalThis, "prompt", (message?: string) => {
        switch (message) {
            case "name":
                return "Garn";
            case "number":
                return "33";
            case "bool":
                return "false";
            default:
                return "";
        }
    });
    const result = promptObj({
        name: "test",
        number: 1,
        bool: true,
    })

    assertEquals(result, {
        name: "Garn",
        number: 33,
        bool: false,
    });

    prompt.restore();


});


Deno.test("promptObj should work with nested properties", () => {
    const prompt = stub(globalThis, "prompt", (message?: string) => {
        switch (message) {
            case "a.b":
                return " 1 ";
            case "a.c.d":
                return " 2 ";
            default:
                return "";
        }
    });
    const result = promptObj({
        a: {
            b: 0,
            c: { d: 1 }
        }
    })

    assertEquals(result, {
        a: {
            b: 1,
            c: { d: 2 }
        }
    });

    prompt.restore();


});



Deno.test("promptObj should work with arrays", { only: true }, () => {
    const prompt = stub(globalThis, "prompt", (message?: string) => {
        console.log({ message });

        switch (message) {
            case "a.0":
                return " 10 ";
            case "a.1":
                return " 20 ";
            case "a.2":
                return " 30 ";
            default:
                return "";
        }
    });
    const confirm = stub(globalThis, "confirm", () => false);
    const result = promptObj({
        a: [1, 2]
    })
    console.log({ result });

    assertEquals(result, {
        a: [10, 20, 30]
    });
    confirm.restore();
    prompt.restore();


});