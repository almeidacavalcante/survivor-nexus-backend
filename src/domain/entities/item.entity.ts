import Entity from "@/domain/entities/entity";

interface Props {
    name: string;
    description: string;
    removesInfection?: boolean;
}

export default class Item extends Entity<Props> {
    constructor(props: Props, id?: string) {
        super(props, id);
        this.props.removesInfection = props.removesInfection ?? false;
    }

    get name(): string {
        return this.props.name;
    }

    get description(): string {
        return this.props.description;
    }

    get removesInfection(): boolean | undefined {
        return this.props.removesInfection;
    }

}
