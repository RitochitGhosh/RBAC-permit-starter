import permit from "@/lib/permitProvider";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id, operation } = req.query;

  try {
    console.log("Reached here! ");
    
    const permitted = await permit.check(String(id), String(operation), {
      type: 'todo-tenant',
      tenant: 'Todo-tenant',
    });
    console.log("Requesst sent!");
    

    if (permitted) {
      res.status(200).json({ status: 'permitted' });
    } else {
      res.status(200).json({ status: 'not-permitted' });
    }
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
}
