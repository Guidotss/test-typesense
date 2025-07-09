
export const typesenseConfig = {
  nodes: [
    {
      host: process.env.TYPESENSE_HOST || "localhost",
      port: Number.parseInt(process.env.TYPESENSE_PORT || "8108"),
      protocol: process.env.TYPESENSE_PROTOCOL || "http",
    },
  ],
  apiKey: process.env.TYPESENSE_API_KEY || "xyz",
  connectionTimeoutSeconds: 2,
}

export const productSchema = {
  name: "products",
  fields: [
    { name: "id", type: "string" },
    { name: "name", type: "string" },
    { name: "description", type: "string" },
    { name: "price", type: "float" },
    { name: "category", type: "string", facet: true },
    { name: "rating", type: "float" },
    { name: "stock", type: "int32" },
    { name: "tags", type: "string[]", facet: true },
  ],
  default_sorting_field: "rating",
}
