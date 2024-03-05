import Position from "@/domain/entities/value-objects/position";

describe('Position Unit Tests', () => {

  it('should create a position successfully', () => {
    const position = new Position(80, 120);
    expect(position.latitude).toBe(80);
    expect(position.longitude).toBe(120);
  });

  it('should throw an error when creating', () => {
    expect(() => {
      const invalidPosition = new Position(91, 120);
    }).toThrowError('Latitude must be between -90 and 90');
  });

  it('should throw an error when creating', () => {
    expect(() => {
      const invalidPosition = new Position(80, 181);
    }).toThrowError('Longitude must be between -180 and 180');
  });

  it('should throw an error when creating', () => {
    expect(() => {
      const invalidPosition = new Position(91, 181);
    }).toThrowError('Latitude must be between -90 and 90');
  });

  it('should return a string representation of the position', () => {
    const position = new Position(12.009392812, 120.848378471);
    expect(position.toString()).toBe('12.009392812, 120.848378471');
  });

  it('should return true when comparing two equal positions', () => {
    const position = new Position(12.009392812, 120.848378471);
    const otherPosition = new Position(12.009392812, 120.848378471);
    expect(position.equals(otherPosition)).toBe(true);
  });
});
