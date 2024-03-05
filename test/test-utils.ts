export const randomEmail = () => {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let userName = '';
  const domains = ['example.com', 'test.com', 'demo.com'];
  for (let i = 0; i < 10; i++) {
    userName += characters.charAt(
      Math.floor(Math.random() * characters.length),
    );
  }
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${userName}@${domain}`;
};

export function randomString() {
  const randomSuffix = Math.random().toString(36).substring(7);
  return randomSuffix;
}
