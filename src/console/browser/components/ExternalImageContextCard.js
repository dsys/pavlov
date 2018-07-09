import ContextCard from './ContextCard';
import React from 'react';
import colors from '../colors';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

@graphql(
  gql`
    query ExternalImageContextCard($imageId: ID!) {
      image(id: $imageId) {
        id
        square512URL
      }
    }
  `
)
export default class ExternalImageContextCard extends React.Component {
  render() {
    const { image } = this.props.data;

    if (image) {
      return (
        <ContextCard>
          <div className="image-wrapper fs-ignore-rage-clicks fs-ignore-formabandon">
            <img src={image.square512URL} />
          </div>
          <style jsx>{`
            .image-wrapper {
              height: 100%;
              border-radius: 4px;
            }
            img {
              display: block;
              background: repeating-linear-gradient(
                45deg,
                ${colors.gray2},
                ${colors.gray2} 10px,
                ${colors.gray3} 10px,
                ${colors.gray3} 20px
              );
              margin: 0 auto;
              padding: 20px;
              max-width: 100%;
              max-height: 100%;
              min-width: 64px;
              border-radius: 4px;
            }
          `}</style>
        </ContextCard>
      );
    } else {
      return <ContextCard title="Image" loading />;
    }
  }
}
