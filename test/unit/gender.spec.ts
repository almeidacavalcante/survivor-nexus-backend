import Gender from "@/domain/entities/value-objects/gender";

describe('Gender Unit Tests', () => {

  it('should create a gender successfully', () => {
    const male = new Gender('male');
    const female = new Gender('FEMALE');
    const other = new Gender('OtHeR');

    expect(male.value).toBe('male');
    expect(female.value).toBe('female');
    expect(other.value).toBe('other');
  });

  it('should throw an error when creating', () => {
    expect(() => {
      const invalidGender = new Gender('invalid');
    }).toThrowError('Invalid gender. Select one of the following options: male, female, other');
  });
});
