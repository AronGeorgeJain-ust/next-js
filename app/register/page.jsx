import RegisterForm from "./RegisterForm";

export default async function Page() {
  let normalized = [];

  try {
    const res = await fetch("http://localhost:8080/api/role/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page: 0,
        sizePerPage: 50,
      }),
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();

      let roles = [];
      if (Array.isArray(data)) roles = data;
      else if (Array.isArray(data?.dtoList)) roles = data.dtoList;
      else if (Array.isArray(data?.content)) roles = data.content;

      normalized = roles.map((r) => r?.identifier || r?.name || r);
    }
  } catch (error) {
    console.error(error);
  }

  return <RegisterForm roles={normalized} />;
}
