import { registry } from "./swagger";

export const registerApi = (
  method: "get" | "post" | "put" | "delete",
  path: string,
  schema: any,
  tag: string
) => {


  registry.registerPath({
    method,
    path,
    tags: [tag],

    request: schema
      ? {
          body: {
            content: {
              "application/json": {
                schema
              }
            }
          }
        }
      : undefined,

    responses: {
      200: {
        description: "Success"
      }
    }
  });
};