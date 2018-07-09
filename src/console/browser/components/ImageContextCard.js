import ContextCard from './ContextCard';
import Icon from './Icon';
import Identifier from './Identifier';
import React from 'react';
import SimpleTable from './SimpleTable';
import colors from '../colors';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

@graphql(
  gql`
    query ImageContextCard($targetId: ID!) {
      target(id: $targetId) {
        id
        image {
          id
          sha256
          contentType
          contentLength
          rawURL
          square512URL
        }
      }
    }
  `
)
export default class ImageContextCard extends React.Component {
  render() {
    const { target } = this.props.data;

    if (target) {
      return (
        <ContextCard>
          <div className="image-wrapper">
            <img src={target.image.square512URL} />
          </div>
          <SimpleTable
            data={[
              ['Image Identifier', <Identifier key="1" id={target.image.id} />],
              ['SHA 256', <small key="1">{target.image.sha256}</small>],
              ['Content Type', target.image.contentType],
              ['Content Length', `${target.image.contentLength} bytes`],
              [
                'Raw Image',
                <a key="1" href={target.image.rawURL}>
                  <Icon
                    inline
                    name="drop"
                    style={{ verticalAlign: 'middle' }}
                  />{' '}
                  Download
                </a>
              ]
            ]}
          />
          <style jsx>{`
            .image-wrapper {
              padding: 40px;
              background: ${colors.gray2};
              border-radius: 4px;
              margin-bottom: 20px;
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
              border-radius: 4px;
              padding: 20px;
              max-width: 100%;
              min-width: 64px;
            }

            small {
              display: block;
              color: ${colors.gray1};
              font-size: 10px;
            }
          `}</style>
        </ContextCard>
      );
    } else {
      return <ContextCard loading />;
    }
  }
}
