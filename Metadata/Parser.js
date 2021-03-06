/* eslint-disable no-multi-spaces, key-spacing */
import IsNil from 'lodash-es/isNil';
import Map from 'lodash-es/map';

import Album from './Models/Album';
import Track from './Models/Track';


const Models = {
    album: Album,
    track: Track
};

const PropertiesByModel = {
    album: {
        'title':                {index: 1},
        'artistTitle':          {index: 2},
        'coverUrl':             {index: 3},

        'tracks':               {index: 6, type: 'list', model: 'track'},
        'id':                   {index: 7},
        'year':                 {index: 9},
        'artistId':             {index: 10},
        'description':          {index: 12}
    },
    track: {
        'key':                  {index: 0},
        'title':                {index: 1},
        'albumCoverUrl':        {index: 2},
        'artistTitle':          {index: 3},
        'albumTitle':           {index: 4},
        'albumArtistTitle':     {index: 5},
        'titleSort':            {index: 6},
        'artistTitleSort':      {index: 7},
        'albumTitleSort':       {index: 8},
        'albumArtistTitleSort': {index: 9},

        'duration':             {index: 13},
        'number':               {index: 14},
        'year':                 {index: 18},

        'trackId':              {index: 28},
        'albumId':              {index: 32},
        'artistId':             {index: 33}
    }
};

export default class MetadataParser {
    static fromJsArray(type, data) {
        if(IsNil(Models[type]) || IsNil(PropertiesByModel[type])) {
            throw new Error('Unsupported model type: ' + type);
        }

        // Retrieve property values
        let values = {};

        for(let key in PropertiesByModel[type]) {
            if(!PropertiesByModel[type].hasOwnProperty(key)) {
                continue;
            }

            let descriptor = PropertiesByModel[type][key];

            if(descriptor.index >= data.length && (IsNil(descriptor.optional) || descriptor.optional === false)) {
                throw new Error('No item available at index: ' + descriptor.index);
            }

            // Retrieve property value
            if(!IsNil(descriptor.model)) {
                if(descriptor.type === 'list') {
                    values[key] = Map(
                        data[descriptor.index],
                        (item) => MetadataParser.fromJsArray(descriptor.model, item)
                    );
                } else {
                    throw new Error('Unsupported model collection type: ' + descriptor.type);
                }
            } else {
                values[key] = data[descriptor.index];
            }
        }

        // Construct instance
        return new Models[type](values);
    }
}
