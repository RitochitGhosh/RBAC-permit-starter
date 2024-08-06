import { Permit } from 'permitio';

const permit = new Permit({
  token: process.env.PERMIT_TOKEN,
  pdp: "https://cloudpdp.api.permit.io",
});

export default permit;
