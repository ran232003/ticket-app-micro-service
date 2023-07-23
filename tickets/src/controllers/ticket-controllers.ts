export const test = (req: any, res: any, next: any) => {
  console.log("here");
  return res.json({ status: "ok" });
};
