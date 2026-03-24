import styled from "styled-components";

export function CardDatosEmpresa({ titulo, valor, img }) {
    return (
        <Container>
            <div className="cardContent">
                {img && (
                    <div className="icon">
                        <img src={img} alt={titulo} />
                    </div>
                )}
                <p className="pricing-plan">{titulo}</p>
                <div className="pricing-value">
                    <span className="pricing-number">{valor}</span>
                </div>
            </div>
        </Container>
    );
}

const Container = styled.div`
    .cardContent {
        position: relative;
        width: 160px;
        padding: 1.25rem 1rem 1rem;
        background: linear-gradient(135deg, #5776ff22, #997ff722);
        border: 1px solid #5776ff33;
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 4px 16px rgba(87, 118, 255, 0.15);
        display: flex;
        flex-direction: column;
        gap: 0.4rem;

        &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #5776ff, #997ff7);
            border-radius: 14px 14px 0 0;
        }

        .icon {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 0.25rem;

            img {
                width: 36px;
                height: 36px;
                object-fit: contain;
            }
        }

        .pricing-plan {
            font-size: 0.8rem;
            font-weight: 600;
            color: ${(props) => props.theme.text2 || "#666"};
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin: 0;
        }

        .pricing-value {
            display: flex;
            align-items: center;
            gap: 0.5rem;

            .pricing-number {
                font-size: 1.5rem;
                font-weight: 800;
                color: ${(props) => props.theme.text || "#000"};
                line-height: 1.2;
            }
        }
    }
`;