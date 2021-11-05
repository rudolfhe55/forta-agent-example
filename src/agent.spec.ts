import {
  FindingType,
  FindingSeverity,
  Finding,
  HandleTransaction,
  createTransactionEvent
} from "forta-agent"
import agent from "./agent"

describe("high gas agent", () => {
  let handleTransaction: HandleTransaction

  const createTxEventWithGasUsed = (gasUsed: string) => createTransactionEvent({
    transaction: {} as any,
    receipt: { gasUsed } as any,
    block: {} as any,
  })

  beforeAll(() => {
    handleTransaction = agent.handleTransaction
  })

  describe("handleTransaction", () => {
    it("returns empty findings if gas used is below threshold", async () => {
      const txEvent = createTxEventWithGasUsed("1")

      const findings = await handleTransaction(txEvent)

      expect(findings).toStrictEqual([])
    })

    it("returns a finding if gas used is above threshold", async () => {
      const txEvent = createTxEventWithGasUsed("1000001")

      const findings = await handleTransaction(txEvent)

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: "High Gas Used",
          description: `Gas Used: ${txEvent.gasUsed}`,
          alertId: "FORTA-1",
          type: FindingType.Suspicious,
          severity: FindingSeverity.Medium
        }),
      ])
    })
  })
})

describe("high gas price", () => {
  let handleTransaction: HandleTransaction

  const createTxEventWithGasPrice = (gasPrice: string) => createTransactionEvent({
    transaction: {} as any,
    receipt: { gasPrice } as any,
    block: {} as any,
  })

  beforeAll(() => {
    handleTransaction = agent.handleTransaction
  })

  describe("handleTransaction", () => {
    it("returns empty findings if gas price is below threshold", async () => {
      const txEvent = createTxEventWithGasPrice("10000000000")

      const findings = await handleTransaction(txEvent)

      expect(findings).toStrictEqual([])
    })

    // it("returns a finding if gas price is above threshold", async () => {
    //   const txEvent = createTxEventWithGasPrice("100000000000")
    //
    //   const findings = await handleTransaction(txEvent)
    //
    //   expect(findings).toStrictEqual([
    //     Finding.fromObject({
    //       name: "High Gas Price",
    //       description: `Gas Price: ${txEvent.gasPrice}`,
    //       alertId: "FORTA-2",
    //       severity: FindingSeverity.Low,
    //       type: FindingType.Info
    //     }),
    //   ])
    // })
  })
})
