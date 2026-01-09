export const fetchVisitAction = async (action: string, token: string) => {
  const res = await fetch(
    `https://pushapp.kioedu.co.kr/api/visit/${action}/${token}`
  );
  // console.log("res:", res.json());
  const text = await res.text();
  console.log(text);
  if (!res.ok) throw new Error("POST failed");
  return text;
};
