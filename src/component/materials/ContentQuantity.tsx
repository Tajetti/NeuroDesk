import { 
    LucideIcon,
    FileText, 
    FileImage, 
    FileVideo, 
    FileAudio 
} from "lucide-react"

type MaterialItem = {
    icon: LucideIcon,
    quantity: number,
    label: string,
    background: string
}

const materialsType: MaterialItem[] = [
    { icon: FileText, quantity: 6, label: 'Documentos', background: 'var(--document-bg)' },
    { icon: FileImage, quantity: 3, label: 'Imagens', background: 'var(--image-bg)' },
    { icon: FileVideo, quantity: 1, label: 'Vídeos', background: 'var(--video-bg)' },
    { icon: FileAudio, quantity: 2, label: 'Áudios', background: 'var(--audio-bg)' }
]

export default function ContentQuantity() {
    return (
        <section
            className="content-quantity mx-auto w-full max-w-[var(--page-max-width)]"
            aria-label="Quantidade de materiais"
        >
            {materialsType.map(({ icon: Icon, quantity, label, background }) => (
                <article className="card-config flex items-center gap-4 px-4" key={label}>
                    <div
                        className="flex size-11 shrink-0 items-center justify-center rounded-2xl text-white"
                        style={{ backgroundColor: background }}
                    >
                        <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                    </div>

                    <div className="leading-none">
                        <strong className="block text-2xl font-semibold text-[var(--primary-text)]">
                            {quantity}
                        </strong>
                        <span className="mt-1.5 block text-xs text-[var(--description-letter)]">
                            {label}
                        </span>
                    </div>
                </article>
            ))}
        </section>
    )
}
