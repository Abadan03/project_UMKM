import { Check, X } from "lucide-react";
import styled from "styled-components";

const pricingFeatures = [
    {
        module: "Report",
        feature: "Business Summary",
        Basic: true,
        professional: true,
    },
    {
        module: "Sales",
        feature: "Point of Sales",
        Basic: true,
        professional: true,
    },
    {
        module: "Inventory",
        feature: "Managing Stock of Goods",
        Basic: false,
        professional: true,
    },
    {
        module: "Finance",
        feature: "Cash Flow",
        Basic: false,
        professional: true,
    },
    {
        module: "Finance",
        feature: "Transaction",
        Basic: true,
        professional: true,
    },
    {
        module: "Notes",
        feature: "Notes / To Do",
        Basic: true,
        professional: true,
    },
];

interface CardPlansProps {
    title: string;
    price: string;
    planKey: "Basic" | "professional";
    description?: string;
}

export function CardPlans({
    title,
    price,
    planKey,
    description,
}: CardPlansProps) {
    return (
        <StyledWrapper>
            <div className="card">
                <div className="card__shine" />
                <div className="card__glow" />

                <div className="card__content">
                    <div className="card__text">
                        <p className="card__title">{title}</p>
                        <p className="card__description">{description}</p>
                    </div>

                    <div className="card__features">
                        {pricingFeatures.map((item) => (
                            <div key={item.feature} className="feature-row">
                                <div>
                                    <p className="feature-name">
                                        {item.feature}
                                    </p>
                                    <p className="feature-module">
                                        {item.module}
                                    </p>
                                </div>

                                {item[planKey] ? (
                                    <Check
                                        size={18}
                                        className="text-green-500"
                                    />
                                ) : (
                                    <X size={18} className="text-red-500" />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="card__footer">
                        <div className="card__price">{price}</div>

                        <button className="card__button">Choose Plan</button>
                    </div>
                </div>
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
    width: 100%;

    .card {
        position: relative;
        overflow: hidden;
        border-radius: 24px;
        background: #1e293b;
        color: white;
        padding: 1.5rem;
        min-height: 600px;
    }

    .card__content {
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: 1.5rem;
    }

    .card__title {
        font-size: 2rem;
        font-weight: 700;
    }

    .card__description {
        color: #cbd5e1;
        margin-top: 0.5rem;
    }

    .card__features {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        flex: 1;
    }

    .feature-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.05);
    }

    .feature-name {
        font-weight: 600;
    }

    .feature-module {
        font-size: 0.75rem;
        color: #94a3b8;
    }

    .card__footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
    }

    .card__price {
        font-size: 2rem;
        font-weight: 700;
    }

    .card__button {
        background: #ffdd00;
        color: #111827;
        border: none;
        border-radius: 12px;
        padding: 0.75rem 1rem;
        font-weight: 700;
        cursor: pointer;
    }

    .card__button:hover {
        opacity: 0.9;
    }
`;
