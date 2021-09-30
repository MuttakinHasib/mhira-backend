
export class Validator {

    static isPhone(value: string) {
        /**
         * Format example +15555555555.
         */
        const conditions = [];
        conditions.push(value.indexOf('+') === 0);
        conditions.push(value.length >= 9);
        conditions.push(value.length <= 16);
        conditions.push(!(/[^\d+]/i.test(value)));

        // Find boolean product of all conditions
        return conditions.reduce(function (prev, curr) {
            return prev && curr;
        });
    }

}
