const assert = require('assert')
const anchor = require('@project-serum/anchor')
const {SystemProgram} = anchor.web3

describe('mycalculatordapp', () => {
    const provider = anchor.AnchorProvider.local();
    anchor.setProvider(provider)
    const calculator = anchor.web3.Keypair.generate()
    const program = anchor.workspace.Mycalculatordapp

    it('creates a calculator', async() => {
        await program.rpc.create("Welcome to Solana", {
            accounts: {
                calculator: calculator.publicKey,
                user: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId
            },
            signers: [calculator]
        })
        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.greeting === "Welcome to Solana")
    })
    it('adds two numbers', async() => {
        await program.rpc.add(new anchor.BN(5), new anchor.BN(8), {
            accounts: {
                calculator: calculator.publicKey
            }
        })
        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.result.eq(new anchor.BN(13)))
    })
    it('subtracts two numbers', async() => {
        await program.rpc.subtract(new anchor.BN(10), new anchor.BN(2), {
            accounts: {
                calculator: calculator.publicKey
            }
        })
        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.result.eq(new anchor.BN(8)))
    })
    it('Multiplies one number by another', async() => {
        await program.rpc.multiply(new anchor.BN(3), new anchor.BN(3), {
            accounts: {
                calculator: calculator.publicKey
            }
        })
        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.result.eq(new anchor.BN(9)))
    })
    it('Divides one number by another', async() => {
        await program.rpc.divide(new anchor.BN(20), new anchor.BN(2), {
            accounts: {
                calculator: calculator.publicKey
            }
        })
        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.result.eq(new anchor.BN(10)))
    })
    it('Divides one number by another with remainder', async() => {
        await program.rpc.divide(new anchor.BN(10), new anchor.BN(3), {
            accounts: {
                calculator: calculator.publicKey
            }
        })
        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.result.eq(new anchor.BN(3)));
        assert.ok(account.remainder.eq(new anchor.BN(1)));
    })
})