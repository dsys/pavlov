import ContextCard from './ContextCard';
import Icon from './Icon';
import Identifier from './Identifier';
import React from 'react';
import SimpleTable from './SimpleTable';
import GoogleMapReact from 'google-map-react';
import colors from '../colors';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const GOOGLE_MAPS_API_KEY = 'AIzaSyA14p9Xp7jUYqIAdoM94x_rYhYUmBLxcsM';

function Marker({ text }) {
  return (
    <div>
      <Icon name="run" width={20} height={20} />
      <style jsx>{`
        div {
          color: ${colors.purple3};
          margin: -10px 0 0 -10px;
          background: ${colors.white};
          width: 20px;
          height: 20px;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

function getZoomLevel({ continent, country, region, state, locality }) {
  if (locality) return 11;
  if (region) return 8;
  if (state) return 6;
  if (country) return 4;
  if (continent) return 0;
  return 12;
}

@graphql(
  gql`
    query IPAddressContextCard($targetId: ID!) {
      target(id: $targetId) {
        id
        ipAddress {
          id
          display
          location {
            display
            continent
            country
            region
            state
            locality
            latitude
            longitude
            timezone
          }
        }
      }
    }
  `
)
export default class IPAddressContextCard extends React.Component {
  render() {
    const { target } = this.props.data;

    if (target) {
      let { latitude, longitude } = target.ipAddress.location;
      latitude = parseFloat(latitude, 10);
      longitude = parseFloat(longitude, 10);

      const zoom = getZoomLevel(target.ipAddress.location);

      return (
        <ContextCard>
          <div className="map-wrapper">
            <GoogleMapReact
              bootstrapURLKeys={{
                key: GOOGLE_MAPS_API_KEY,
                language: 'en',
                region: 'us'
              }}
              center={[latitude, longitude]}
              zoom={zoom}
            >
              <Marker
                lat={latitude}
                lng={longitude}
                text={target.ipAddress.display}
              />
            </GoogleMapReact>
          </div>
          <SimpleTable
            data={[
              [
                'IP Address Identifier',
                <Identifier key="1" id={target.ipAddress.id} />
              ],
              ['Address', target.ipAddress.display],
              [
                'Location',
                target.ipAddress.location && target.ipAddress.location.display
              ],
              [
                'Continent',
                target.ipAddress.location && target.ipAddress.location.continent
              ],
              [
                'Country',
                target.ipAddress.location && target.ipAddress.location.country
              ],
              [
                'Region',
                target.ipAddress.location && target.ipAddress.location.region
              ],
              [
                'State',
                target.ipAddress.location && target.ipAddress.location.state
              ],
              [
                'Locality',
                target.ipAddress.location && target.ipAddress.location.locality
              ],
              ['Latitude', latitude],
              ['Longitude', longitude]
            ]}
          />
          <style jsx>{`
            .map-wrapper {
              background: ${colors.gray2};
              border-radius: 4px;
              overflow: hidden;
              margin-bottom: 20px;
              height: 300px;
            }
          `}</style>
        </ContextCard>
      );
    } else {
      return <ContextCard loading />;
    }
  }
}
