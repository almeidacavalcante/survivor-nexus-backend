import DomainException from '@/domain/exceptions/domain-exception';

export default class Position {
    private readonly _latitude: number;
    private readonly _longitude: number;

    constructor(latitude: number, longitude: number) {
        this.validate(latitude, longitude);
        this._latitude = latitude;
        this._longitude = longitude;
    }

    validate(latitude: number, longitude: number) {
        if (latitude < -90 || latitude > 90) {
            throw new DomainException("Latitude must be between -90 and 90");
        }

        if (longitude < -180 || longitude > 180) {
            throw new DomainException("Longitude must be between -180 and 180");
        }
    }

    get latitude(): number {
        return this._latitude;
    }

    get longitude(): number {
        return this._longitude;
    }

    equals(position: Position): boolean {
        return this._latitude === position.latitude && this._longitude === position.longitude;
    }

    toString(): string {
        return `${this._latitude}, ${this._longitude}`;
    }
}
