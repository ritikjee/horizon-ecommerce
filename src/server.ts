import express, { Express, Request, Response } from "express";
import { getPayloadClient } from "./get-payload";
import { nextApp, nextHandler } from "./next-utils";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";
import { inferAsyncReturnType } from "@trpc/server";
import { IncomingMessage } from "http";
import bodyParser from "body-parser";
import { stripeWebhookHandler } from "./webhook";
import nextBuild from "next/dist/build";
import path from "path";

const app: Express = express();
const port = process.env.PORT || 3000;

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
});

export type ExpressContext = inferAsyncReturnType<typeof createContext>;
export type WebhookRequest = IncomingMessage & { rawBody: Buffer };

const start = async () => {
  const webhookMiddleware = bodyParser.json({
    verify: (req: WebhookRequest, _, buffer) => {
      req.rawBody = buffer;
    },
  });

  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: () => {
        console.log("Payload is ready!");
      },
    },
  });

  if (process.env.NEXT_BUILD) {
    app.listen(port, async () => {
      payload.logger.info("Next.js is building for production");

      //@ts-expect-error
      await nextBuild(path.join(__dirname, "../"));

      process.exit();
    });

    return;
  }

  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({ router: appRouter, createContext })
  );

  app.post("/api/stripe/webhook", webhookMiddleware, stripeWebhookHandler);

  app.use((req: Request, res: Response) => nextHandler(req, res));

  nextApp.prepare().then(() => {
    console.log(`> Ready on http://localhost:${port}`);
  });

  app.listen(port, () => {
    console.log(
      `Express is now listening for incoming connections on port ${port}`
    );
  });
};

start();
