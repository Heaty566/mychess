//* where magic come from
export function defuse(promise) {
        promise.catch(() => {
                //
        });
        return promise;
}
