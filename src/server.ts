import { createApp } from "./app";
import { startGrpcServer } from "./grpc/grpc-server";
import { configs } from "./configs/ENV_configs/ENV.configs";

const app = createApp();

app.listen(configs.PORT, () => {
  console.log(`Admin service running on port ${configs.PORT}`);
});

startGrpcServer();