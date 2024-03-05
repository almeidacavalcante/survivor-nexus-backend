import EntityId from "./entity-id";

export default class Entity<Props> {
  private readonly _id: EntityId;
  private readonly _createdAt: Date;
  private _updatedAt?: Date;
  protected props: Props;

  constructor(props: Props, id?: string) {
    this._id = new EntityId(id);
    this._createdAt = new Date();
    this.props = props;
  }

  protected touch() {
    this._updatedAt = new Date();
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get id(): EntityId {
    return this._id;
  }
}
