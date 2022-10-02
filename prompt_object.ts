



export function promptObj<T>(object: T, path: string[] = []): T {
    console.log({ object, path });

    const result = {} as T;
    for (const key in object) {
        let answer = null;
        const value = object[key];
        const type = typeof value !== 'object' ? typeof value : Array.isArray(value) ? 'array' : 'object';
        console.log({ type, key });

        switch (type) {
            case 'number':
                console.log('number');

                answer = Number(ask(key, path, object[key]));
                break;
            case 'boolean':
                answer = 'true' == ask(key, path, object[key]);
                break;
            case 'string':
                answer = ask(key, path, object[key]);
                break;
            case 'object':
                answer = promptObj(value, path.concat(key));
                break;
            case 'array':
                answer = promptArray(value, path.concat(key));

                break;
        }
        // deno-lint-ignore no-explicit-any
        result[key] = answer as unknown as any;
        // console.log(answer);

    }

    return result

}


export function promptArray<T>(array: T, path: string[]): T {
    // if (array.length !== 1) {
    //     throw new Error("Array must have one element. And all elements must be the same type.");
    // }
    const answers = [] as T;
    let i = 0;
    const value = array[0];
    do {
        const response = promptObj(value, path.concat(String(i)));
        answers.push(response);
        i++;
    } while (confirm('Add another?'));
    return answers;

}


function ask(key: string, path: string[], initial: unknown): string {
    console.log({ key, path, initial });
    const question = path.concat(key).join('.');
    const answer = prompt(question, String(initial)) || '';
    return answer.trim();
}