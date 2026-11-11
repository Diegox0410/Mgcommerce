
import { useId } from 'react'

type MGLogoProps = {
  className?: string
  size?: number
}

export function MGLogo({
  className,
  size = 90,
}: MGLogoProps) {
  const id = useId()

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 360 360"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby={id}
    >
      <title id={id}>
        MG Salud y Belleza - Centro Estético
      </title>

      <g
        fill="none"
        stroke="#A3843E"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Corona floral */}
        <path
          d="M91 135 C113 61 216 40 274 103
             C337 169 295 279 207 296
             C148 307 98 271 81 220"
          strokeWidth="1.7"
        />

        <path
          d="M107 111 C145 59 243 62 273 118"
          strokeWidth=".85"
        />

        <path
          d="M89 223 C108 274 157 299 212 295"
          strokeWidth="1"
        />

        {/* Flor izquierda */}
        <g strokeWidth="1.7">
          <path
            d="M91 171 C74 159 70 146 77 138
               C87 132 96 140 100 149
               C108 135 121 134 128 144
               C128 161 111 172 91 171Z"
          />

          <path
            d="M92 170 C95 153 103 146 111 146
               M91 171 C83 158 82 151 83 146"
          />

          <path d="M93 171 C91 198 79 224 67 242" />

          <path
            d="M85 195 C58 177 53 161 59 156
               C72 157 84 171 85 195Z"
          />

          <path
            d="M77 215 C98 192 112 194 117 200
               C107 215 92 220 77 215Z"
          />
        </g>

        {/* Flor derecha */}
        <g strokeWidth="1.7">
          <path
            d="M283 164 C297 147 312 148 320 158
               C321 170 304 178 286 178
               C309 180 318 192 313 202
               C296 206 285 193 283 181
               C279 199 264 205 256 197
               C257 181 266 171 283 164Z"
          />

          <path d="M284 179 C280 209 264 229 249 245" />

          <path
            d="M267 217 C290 207 300 213 303 222
               C291 229 278 226 267 217Z"
          />
        </g>

        {/* Pequeñas hojas */}
        <path
          d="M245 79 Q238 61 250 55
             Q258 70 245 79Z"
          strokeWidth="1.2"
        />

        <path
          d="M229 282 Q239 267 248 272
             Q244 285 229 282Z"
          strokeWidth="1.2"
        />

        {/* Puntos ornamentales */}
        {[
          [119, 90], [130, 82], [145, 72],
          [163, 66], [188, 65], [211, 69],
          [234, 79], [261, 102], [278, 124],
          [81, 246], [95, 264], [112, 279],
          [134, 288], [156, 297], [223, 291],
        ].map(([cx, cy], index) => (
          <circle
            key={index}
            cx={cx}
            cy={cy}
            r={index % 3 === 0 ? 2 : 1.2}
            fill="#A3843E"
            stroke="none"
          />
        ))}
      </g>

      {/* Iniciales */}
      <text
        x="180"
        y="188"
        textAnchor="middle"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontSize="112"
        fontWeight="500"
        letterSpacing="-9"
        fill="#98732F"
      >
        MG
      </text>

      {/* Nombre */}
      <text
        x="180"
        y="224"
        textAnchor="middle"
        fontFamily="Manrope, Arial, sans-serif"
        fontSize="14"
        fontWeight="600"
        letterSpacing="2.4"
        fill="#98732F"
      >
        SALUD &amp; BELLEZA
      </text>

      {/* Subtítulo */}
      <text
        x="180"
        y="250"
        textAnchor="middle"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontSize="20"
        fill="#66564B"
      >
        Centro Estético
      </text>
    </svg>
  )
}
