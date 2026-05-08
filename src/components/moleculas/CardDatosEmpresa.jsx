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
        background: linear-gradient(
            135deg, 
            ${(props) => props.theme.text}11 0%, 
            ${(props) => props.theme.primary}11 100%
        );
        border: 1px solid ${(props) => props.theme.text}22;
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 4px 16px rgba(0, 63, 146, 0.1);
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
            background: linear-gradient(
                90deg, 
                ${(props) => props.theme.text}, 
                ${(props) => props.theme.primary}
            );
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
                filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.1));
            }
        }

        .pricing-plan {
            font-size: 0.75rem;
            font-weight: 700;
            color: ${(props) => props.theme.colorSubtitle || props.theme.primary};
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin: 0;
        }

        .pricing-value {
            display: flex;
            align-items: center;
            gap: 0.5rem;

            .pricing-number {
                font-size: 1.4rem;
                font-weight: 800;
                color: ${(props) => props.theme.text};
                line-height: 1.2;
            }
        }
    }
`;