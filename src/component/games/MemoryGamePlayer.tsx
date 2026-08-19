import { useEffect, useRef, useState } from "react"
import Phaser from "phaser"

import type { MemoryGameConfig } from "../../games/gameType"

type MemoryGamePlayerProps = {
    config: MemoryGameConfig
    onFinish: (result: { correct: number; incorrect: number; completed: number; label?: string }) => void
}

export default function MemoryGamePlayer({ config, onFinish }: MemoryGamePlayerProps) {
    const hostRef = useRef<HTMLDivElement>(null)
    const [moves, setMoves] = useState(0)
    const [completed, setCompleted] = useState(false)

    useEffect(() => {
        if (!hostRef.current) return
        setMoves(0)
        setCompleted(false)

        const cards = config.pairs.flatMap((pair) => [
            { ...pair, cardId: `${pair.id}-a` },
            { ...pair, cardId: `${pair.id}-b` }
        ]).sort(() => Math.random() - 0.5)

        const columns = Math.min(4, Math.max(2, Math.ceil(Math.sqrt(cards.length))))
        const cardWidth = 150
        const cardHeight = 180
        const gap = 18
        const width = columns * cardWidth + (columns + 1) * gap
        const rows = Math.ceil(cards.length / columns)
        const height = rows * cardHeight + (rows + 1) * gap
        let firstCard: Phaser.GameObjects.Container | null = null
        let firstPairId = ""
        let locked = false
        let matchedPairs = 0
        let moveCount = 0

        const game = new Phaser.Game({
            type: Phaser.AUTO,
            parent: hostRef.current,
            width,
            height,
            backgroundColor: config.backgroundColor,
            scene: {
                preload() {
                    config.pairs.forEach((pair) => {
                        if (pair.imageUrl) this.load.image(`pair-${pair.id}`, pair.imageUrl)
                    })
                },
                create() {
                    cards.forEach((card, index) => {
                        const column = index % columns
                        const row = Math.floor(index / columns)
                        const x = gap + cardWidth / 2 + column * (cardWidth + gap)
                        const y = gap + cardHeight / 2 + row * (cardHeight + gap)
                        const container = this.add.container(x, y)
                        const face = this.add.rectangle(0, 0, cardWidth, cardHeight, 0xffffff).setStrokeStyle(2, 0x2a97ad)
                        const cover = this.add.rectangle(0, 0, cardWidth, cardHeight, 0x2a97ad)
                        const question = this.add.text(0, 0, "?", { fontSize: "44px", color: "#ffffff", fontFamily: "Arial" }).setOrigin(0.5)
                        const label = this.add.text(0, card.imageUrl ? 58 : 0, card.label, { fontSize: "18px", color: "#172532", fontFamily: "Arial", align: "center", wordWrap: { width: 130 } }).setOrigin(0.5).setVisible(false)
                        const textureKey = `pair-${card.id}`
                        const image = card.imageUrl && this.textures.exists(textureKey)
                            ? this.add.image(0, -15, textureKey).setDisplaySize(110, 110).setVisible(false)
                            : null

                        container.add([face, ...(image ? [image] : []), label, cover, question])
                        container.setSize(cardWidth, cardHeight).setInteractive({ useHandCursor: true })
                        container.setData({ pairId: card.id, cover, question, label, image, matched: false })

                        const reveal = (target: Phaser.GameObjects.Container, visible: boolean) => {
                            target.getData("cover").setVisible(!visible)
                            target.getData("question").setVisible(!visible)
                            target.getData("label").setVisible(visible)
                            target.getData("image")?.setVisible(visible)
                        }

                        container.on("pointerdown", () => {
                            if (locked || container.getData("matched") || container === firstCard) return
                            reveal(container, true)

                            if (!firstCard) {
                                firstCard = container
                                firstPairId = container.getData("pairId")
                                return
                            }

                            moveCount += 1
                            setMoves(moveCount)
                            if (firstPairId === container.getData("pairId")) {
                                firstCard.setData("matched", true)
                                container.setData("matched", true)
                                firstCard = null
                                matchedPairs += 1
                                if (matchedPairs === config.pairs.length) {
                                    setCompleted(true)
                                    this.time.delayedCall(650, () => onFinish({ correct: config.pairs.length, incorrect: Math.max(0, moveCount - config.pairs.length), completed: config.pairs.length, label: `Todos os pares foram encontrados em ${moveCount} jogadas.` }))
                                }
                                return
                            }

                            locked = true
                            const previousCard = firstCard
                            firstCard = null
                            this.time.delayedCall(750, () => {
                                reveal(previousCard, false)
                                reveal(container, false)
                                locked = false
                            })
                        })
                    })
                }
            }
        })

        return () => game.destroy(true)
    }, [config, onFinish])

    return (
        <div>
            <div className="mb-4 flex items-center justify-between text-sm font-semibold text-[var(--description-letter)]">
                <span>Jogadas: {moves}</span>
                {completed && <span className="text-emerald-600">Parabéns! Você encontrou todos os pares.</span>}
            </div>
            <div ref={hostRef} className="overflow-auto rounded-2xl" />
        </div>
    )
}
