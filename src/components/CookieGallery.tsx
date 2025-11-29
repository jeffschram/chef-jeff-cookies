import React, { useState } from "react";
import styled from "styled-components";
import CookieImage from "./CookieImage";

const GalleryContainer = styled.div`
  margin: 1rem 0;
`;

const MainImage = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

const ThumbnailGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Thumbnail = styled.button<{ $isActive: boolean }>`
  border: 3px solid
    ${(props) => (props.$isActive ? "var(--text-1)" : "transparent")};
  border-radius: 50%;
  padding: 2px;
  background: none;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: var(--accent-color);
  }
`;

interface CookieGalleryProps {
  packageType: "nibbler" | "family" | "pro";
}

export default function CookieGallery({ packageType }: CookieGalleryProps) {
  const [selectedVariant, setSelectedVariant] = useState(0);

  return (
    <GalleryContainer>
      <MainImage>
        <CookieImage
          packageType={packageType}
          variant={selectedVariant}
          size={150}
        />
      </MainImage>

      <ThumbnailGrid>
        {[0, 1, 2, 3, 4].map((variant) => (
          <Thumbnail
            key={variant}
            $isActive={selectedVariant === variant}
            onClick={() => setSelectedVariant(variant)}
          >
            <CookieImage
              packageType={packageType}
              variant={variant}
              size={40}
            />
          </Thumbnail>
        ))}
      </ThumbnailGrid>
    </GalleryContainer>
  );
}
