import DomainException from '@/domain/exceptions/domain-exception';

export default class Gender {
    private _value: string;
    private _genders = ['male', 'female', 'other'];

    constructor(value: string) {
        this.validate(value);
        this._value = value.toLowerCase();
    }

    validate(value: string) {
        if (this._genders.indexOf(value.toLowerCase()) === -1) {
            throw new DomainException(`Invalid gender. Select one of the following options: ${this._genders.join(', ')}`);
        }
    }

    get value(): string {
        return this._value;
    }
}
