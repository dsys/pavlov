BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO
$body$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles WHERE rolname = 'console') THEN
      CREATE USER console PASSWORD 'comehome';
   END IF;
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles WHERE rolname = 'sandbox') THEN
      CREATE ROLE sandbox;
   END IF;
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles WHERE rolname = 'sandbox_r') THEN
      CREATE USER sandbox_r WITH ROLE sandbox PASSWORD 'comehome';
   END IF;
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles WHERE rolname = 'sandbox_rw') THEN
      CREATE USER sandbox_rw WITH ROLE sandbox PASSWORD 'comehome';
   END IF;
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles WHERE rolname = 'external_task_sandbox') THEN
      CREATE USER external_task_sandbox PASSWORD 'comehome';
   END IF;
END
$body$;

--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.2
-- Dumped by pg_dump version 9.6.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: entity_graph; Type: SCHEMA; Schema: -; 
--

CREATE SCHEMA entity_graph;



--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: ec2-user
--

CREATE SCHEMA storage;



SET search_path = public, pg_catalog;

--
-- Name: target_arity; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE target_arity AS ENUM (
    'NONE',
    'OPTIONAL',
    'REQUIRED'
);



--
-- Name: timezone; Type: TYPE; Schema: public; Owner: ec2-user
--

CREATE TYPE timezone AS ENUM (
    'AFRICA_ABIDJAN',
    'AFRICA_ACCRA',
    'AFRICA_ADDIS_ABABA',
    'AFRICA_ALGIERS',
    'AFRICA_ASMARA',
    'AFRICA_BAMAKO',
    'AFRICA_BANGUI',
    'AFRICA_BANJUL',
    'AFRICA_BISSAU',
    'AFRICA_BLANTYRE',
    'AFRICA_BRAZZAVILLE',
    'AFRICA_BUJUMBURA',
    'AFRICA_CAIRO',
    'AFRICA_CASABLANCA',
    'AFRICA_CEUTA',
    'AFRICA_CONAKRY',
    'AFRICA_DAKAR',
    'AFRICA_DAR_ES_SALAAM',
    'AFRICA_DJIBOUTI',
    'AFRICA_DOUALA',
    'AFRICA_EL_AAIUN',
    'AFRICA_FREETOWN',
    'AFRICA_GABORONE',
    'AFRICA_HARARE',
    'AFRICA_JOHANNESBURG',
    'AFRICA_KAMPALA',
    'AFRICA_KHARTOUM',
    'AFRICA_KIGALI',
    'AFRICA_KINSHASA',
    'AFRICA_LAGOS',
    'AFRICA_LIBREVILLE',
    'AFRICA_LOME',
    'AFRICA_LUANDA',
    'AFRICA_LUBUMBASHI',
    'AFRICA_LUSAKA',
    'AFRICA_MALABO',
    'AFRICA_MAPUTO',
    'AFRICA_MASERU',
    'AFRICA_MBABANE',
    'AFRICA_MOGADISHU',
    'AFRICA_MONROVIA',
    'AFRICA_NAIROBI',
    'AFRICA_NDJAMENA',
    'AFRICA_NIAMEY',
    'AFRICA_NOUAKCHOTT',
    'AFRICA_OUAGADOUGOU',
    'AFRICA_PORTO_NOVO',
    'AFRICA_SAO_TOME',
    'AFRICA_TRIPOLI',
    'AFRICA_TUNIS',
    'AFRICA_WINDHOEK',
    'AMERICA_ADAK',
    'AMERICA_ANCHORAGE',
    'AMERICA_ANGUILLA',
    'AMERICA_ANTIGUA',
    'AMERICA_ARAGUAINA',
    'AMERICA_ARGENTINA_BUENOS_AIRES',
    'AMERICA_ARGENTINA_CATAMARCA',
    'AMERICA_ARGENTINA_CORDOBA',
    'AMERICA_ARGENTINA_JUJUY',
    'AMERICA_ARGENTINA_LA_RIOJA',
    'AMERICA_ARGENTINA_MENDOZA',
    'AMERICA_ARGENTINA_RIO_GALLEGOS',
    'AMERICA_ARGENTINA_SALTA',
    'AMERICA_ARGENTINA_SAN_JUAN',
    'AMERICA_ARGENTINA_SAN_LUIS',
    'AMERICA_ARGENTINA_TUCUMAN',
    'AMERICA_ARGENTINA_USHUAIA',
    'AMERICA_ARUBA',
    'AMERICA_ASUNCION',
    'AMERICA_ATIKOKAN',
    'AMERICA_BAHIA',
    'AMERICA_BAHIA_BANDERAS',
    'AMERICA_BARBADOS',
    'AMERICA_BELEM',
    'AMERICA_BELIZE',
    'AMERICA_BLANC_SABLON',
    'AMERICA_BOA_VISTA',
    'AMERICA_BOGOTA',
    'AMERICA_BOISE',
    'AMERICA_CAMBRIDGE_BAY',
    'AMERICA_CAMPO_GRANDE',
    'AMERICA_CANCUN',
    'AMERICA_CARACAS',
    'AMERICA_CAYENNE',
    'AMERICA_CAYMAN',
    'AMERICA_CHICAGO',
    'AMERICA_CHIHUAHUA',
    'AMERICA_COSTA_RICA',
    'AMERICA_CUIABA',
    'AMERICA_CURACAO',
    'AMERICA_DANMARKSHAVN',
    'AMERICA_DAWSON',
    'AMERICA_DAWSON_CREEK',
    'AMERICA_DENVER',
    'AMERICA_DETROIT',
    'AMERICA_DOMINICA',
    'AMERICA_EDMONTON',
    'AMERICA_EIRUNEPE',
    'AMERICA_EL_SALVADOR',
    'AMERICA_FORTALEZA',
    'AMERICA_GLACE_BAY',
    'AMERICA_GODTHAB',
    'AMERICA_GOOSE_BAY',
    'AMERICA_GRAND_TURK',
    'AMERICA_GRENADA',
    'AMERICA_GUADELOUPE',
    'AMERICA_GUATEMALA',
    'AMERICA_GUAYAQUIL',
    'AMERICA_GUYANA',
    'AMERICA_HALIFAX',
    'AMERICA_HAVANA',
    'AMERICA_HERMOSILLO',
    'AMERICA_INDIANA_INDIANAPOLIS',
    'AMERICA_INDIANA_KNOX',
    'AMERICA_INDIANA_MARENGO',
    'AMERICA_INDIANA_PETERSBURG',
    'AMERICA_INDIANA_TELL_CITY',
    'AMERICA_INDIANA_VEVAY',
    'AMERICA_INDIANA_VINCENNES',
    'AMERICA_INDIANA_WINAMAC',
    'AMERICA_INUVIK',
    'AMERICA_IQALUIT',
    'AMERICA_JAMAICA',
    'AMERICA_JUNEAU',
    'AMERICA_KENTUCKY_LOUISVILLE',
    'AMERICA_KENTUCKY_MONTICELLO',
    'AMERICA_LA_PAZ',
    'AMERICA_LIMA',
    'AMERICA_LOS_ANGELES',
    'AMERICA_MACEIO',
    'AMERICA_MANAGUA',
    'AMERICA_MANAUS',
    'AMERICA_MARTINIQUE',
    'AMERICA_MATAMOROS',
    'AMERICA_MAZATLAN',
    'AMERICA_MENOMINEE',
    'AMERICA_MERIDA',
    'AMERICA_MEXICO_CITY',
    'AMERICA_MIQUELON',
    'AMERICA_MONCTON',
    'AMERICA_MONTERREY',
    'AMERICA_MONTEVIDEO',
    'AMERICA_MONTREAL',
    'AMERICA_MONTSERRAT',
    'AMERICA_NASSAU',
    'AMERICA_NEW_YORK',
    'AMERICA_NIPIGON',
    'AMERICA_NOME',
    'AMERICA_NORONHA',
    'AMERICA_NORTH_DAKOTA_CENTER',
    'AMERICA_NORTH_DAKOTA_NEW_SALEM',
    'AMERICA_OJINAGA',
    'AMERICA_PANAMA',
    'AMERICA_PANGNIRTUNG',
    'AMERICA_PARAMARIBO',
    'AMERICA_PHOENIX',
    'AMERICA_PORTO_VELHO',
    'AMERICA_PORT_AU_PRINCE',
    'AMERICA_PORT_OF_SPAIN',
    'AMERICA_PUERTO_RICO',
    'AMERICA_RAINY_RIVER',
    'AMERICA_RANKIN_INLET',
    'AMERICA_RECIFE',
    'AMERICA_REGINA',
    'AMERICA_RESOLUTE',
    'AMERICA_RIO_BRANCO',
    'AMERICA_SANTAREM',
    'AMERICA_SANTA_ISABEL',
    'AMERICA_SANTIAGO',
    'AMERICA_SANTO_DOMINGO',
    'AMERICA_SAO_PAULO',
    'AMERICA_SCORESBYSUND',
    'AMERICA_ST_JOHNS',
    'AMERICA_ST_KITTS',
    'AMERICA_ST_LUCIA',
    'AMERICA_ST_THOMAS',
    'AMERICA_ST_VINCENT',
    'AMERICA_SWIFT_CURRENT',
    'AMERICA_TEGUCIGALPA',
    'AMERICA_THULE',
    'AMERICA_THUNDER_BAY',
    'AMERICA_TIJUANA',
    'AMERICA_TORONTO',
    'AMERICA_TORTOLA',
    'AMERICA_VANCOUVER',
    'AMERICA_WHITEHORSE',
    'AMERICA_WINNIPEG',
    'AMERICA_YAKUTAT',
    'AMERICA_YELLOWKNIFE',
    'ANTARCTICA_CASEY',
    'ANTARCTICA_DAVIS',
    'ANTARCTICA_DUMONTDURVILLE',
    'ANTARCTICA_MACQUARIE',
    'ANTARCTICA_MAWSON',
    'ANTARCTICA_MCMURDO',
    'ANTARCTICA_PALMER',
    'ANTARCTICA_ROTHERA',
    'ANTARCTICA_SYOWA',
    'ANTARCTICA_VOSTOK',
    'ASIA_ADEN',
    'ASIA_ALMATY',
    'ASIA_AMMAN',
    'ASIA_ANADYR',
    'ASIA_AQTAU',
    'ASIA_AQTOBE',
    'ASIA_ASHGABAT',
    'ASIA_BAGHDAD',
    'ASIA_BAHRAIN',
    'ASIA_BAKU',
    'ASIA_BANGKOK',
    'ASIA_BEIRUT',
    'ASIA_BISHKEK',
    'ASIA_BRUNEI',
    'ASIA_CHOIBALSAN',
    'ASIA_CHONGQING',
    'ASIA_COLOMBO',
    'ASIA_DAMASCUS',
    'ASIA_DHAKA',
    'ASIA_DILI',
    'ASIA_DUBAI',
    'ASIA_DUSHANBE',
    'ASIA_GAZA',
    'ASIA_HARBIN',
    'ASIA_HONG_KONG',
    'ASIA_HOVD',
    'ASIA_HO_CHI_MINH',
    'ASIA_IRKUTSK',
    'ASIA_JAKARTA',
    'ASIA_JAYAPURA',
    'ASIA_JERUSALEM',
    'ASIA_KABUL',
    'ASIA_KAMCHATKA',
    'ASIA_KARACHI',
    'ASIA_KASHGAR',
    'ASIA_KATHMANDU',
    'ASIA_KOLKATA',
    'ASIA_KRASNOYARSK',
    'ASIA_KUALA_LUMPUR',
    'ASIA_KUCHING',
    'ASIA_KUWAIT',
    'ASIA_MACAU',
    'ASIA_MAGADAN',
    'ASIA_MAKASSAR',
    'ASIA_MANILA',
    'ASIA_MUSCAT',
    'ASIA_NICOSIA',
    'ASIA_NOVOKUZNETSK',
    'ASIA_NOVOSIBIRSK',
    'ASIA_OMSK',
    'ASIA_ORAL',
    'ASIA_PHNOM_PENH',
    'ASIA_PONTIANAK',
    'ASIA_PYONGYANG',
    'ASIA_QATAR',
    'ASIA_QYZYLORDA',
    'ASIA_RANGOON',
    'ASIA_RIYADH',
    'ASIA_SAKHALIN',
    'ASIA_SAMARKAND',
    'ASIA_SEOUL',
    'ASIA_SHANGHAI',
    'ASIA_SINGAPORE',
    'ASIA_TAIPEI',
    'ASIA_TASHKENT',
    'ASIA_TBILISI',
    'ASIA_TEHRAN',
    'ASIA_THIMPHU',
    'ASIA_TOKYO',
    'ASIA_ULAANBAATAR',
    'ASIA_URUMQI',
    'ASIA_VIENTIANE',
    'ASIA_VLADIVOSTOK',
    'ASIA_YAKUTSK',
    'ASIA_YEKATERINBURG',
    'ASIA_YEREVAN',
    'ATLANTIC_AZORES',
    'ATLANTIC_BERMUDA',
    'ATLANTIC_CANARY',
    'ATLANTIC_CAPE_VERDE',
    'ATLANTIC_FAROE',
    'ATLANTIC_MADEIRA',
    'ATLANTIC_REYKJAVIK',
    'ATLANTIC_SOUTH_GEORGIA',
    'ATLANTIC_STANLEY',
    'ATLANTIC_ST_HELENA',
    'AUSTRALIA_ADELAIDE',
    'AUSTRALIA_BRISBANE',
    'AUSTRALIA_BROKEN_HILL',
    'AUSTRALIA_CURRIE',
    'AUSTRALIA_DARWIN',
    'AUSTRALIA_EUCLA',
    'AUSTRALIA_HOBART',
    'AUSTRALIA_LINDEMAN',
    'AUSTRALIA_LORD_HOWE',
    'AUSTRALIA_MELBOURNE',
    'AUSTRALIA_PERTH',
    'AUSTRALIA_SYDNEY',
    'CANADA_ATLANTIC',
    'CANADA_CENTRAL',
    'CANADA_EASTERN',
    'CANADA_MOUNTAIN',
    'CANADA_NEWFOUNDLAND',
    'CANADA_PACIFIC',
    'EUROPE_AMSTERDAM',
    'EUROPE_ANDORRA',
    'EUROPE_ATHENS',
    'EUROPE_BELGRADE',
    'EUROPE_BERLIN',
    'EUROPE_BRUSSELS',
    'EUROPE_BUCHAREST',
    'EUROPE_BUDAPEST',
    'EUROPE_CHISINAU',
    'EUROPE_COPENHAGEN',
    'EUROPE_DUBLIN',
    'EUROPE_GIBRALTAR',
    'EUROPE_HELSINKI',
    'EUROPE_ISTANBUL',
    'EUROPE_KALININGRAD',
    'EUROPE_KIEV',
    'EUROPE_LISBON',
    'EUROPE_LONDON',
    'EUROPE_LUXEMBOURG',
    'EUROPE_MADRID',
    'EUROPE_MALTA',
    'EUROPE_MINSK',
    'EUROPE_MONACO',
    'EUROPE_MOSCOW',
    'EUROPE_OSLO',
    'EUROPE_PARIS',
    'EUROPE_PRAGUE',
    'EUROPE_RIGA',
    'EUROPE_ROME',
    'EUROPE_SAMARA',
    'EUROPE_SIMFEROPOL',
    'EUROPE_SOFIA',
    'EUROPE_STOCKHOLM',
    'EUROPE_TALLINN',
    'EUROPE_TIRANE',
    'EUROPE_UZHGOROD',
    'EUROPE_VADUZ',
    'EUROPE_VIENNA',
    'EUROPE_VILNIUS',
    'EUROPE_VOLGOGRAD',
    'EUROPE_WARSAW',
    'EUROPE_ZAPOROZHYE',
    'EUROPE_ZURICH',
    'GMT',
    'INDIAN_ANTANANARIVO',
    'INDIAN_CHAGOS',
    'INDIAN_CHRISTMAS',
    'INDIAN_COCOS',
    'INDIAN_COMORO',
    'INDIAN_KERGUELEN',
    'INDIAN_MAHE',
    'INDIAN_MALDIVES',
    'INDIAN_MAURITIUS',
    'INDIAN_MAYOTTE',
    'INDIAN_REUNION',
    'PACIFIC_APIA',
    'PACIFIC_AUCKLAND',
    'PACIFIC_CHATHAM',
    'PACIFIC_CHUUK',
    'PACIFIC_EASTER',
    'PACIFIC_EFATE',
    'PACIFIC_ENDERBURY',
    'PACIFIC_FAKAOFO',
    'PACIFIC_FIJI',
    'PACIFIC_FUNAFUTI',
    'PACIFIC_GALAPAGOS',
    'PACIFIC_GAMBIER',
    'PACIFIC_GUADALCANAL',
    'PACIFIC_GUAM',
    'PACIFIC_HONOLULU',
    'PACIFIC_JOHNSTON',
    'PACIFIC_KIRITIMATI',
    'PACIFIC_KOSRAE',
    'PACIFIC_KWAJALEIN',
    'PACIFIC_MAJURO',
    'PACIFIC_MARQUESAS',
    'PACIFIC_MIDWAY',
    'PACIFIC_NAURU',
    'PACIFIC_NIUE',
    'PACIFIC_NORFOLK',
    'PACIFIC_NOUMEA',
    'PACIFIC_PAGO_PAGO',
    'PACIFIC_PALAU',
    'PACIFIC_PITCAIRN',
    'PACIFIC_POHNPEI',
    'PACIFIC_PORT_MORESBY',
    'PACIFIC_RAROTONGA',
    'PACIFIC_SAIPAN',
    'PACIFIC_TAHITI',
    'PACIFIC_TARAWA',
    'PACIFIC_TONGATAPU',
    'PACIFIC_WAKE',
    'PACIFIC_WALLIS',
    'US_ALASKA',
    'US_ARIZONA',
    'US_CENTRAL',
    'US_EASTERN',
    'US_HAWAII',
    'US_MOUNTAIN',
    'US_PACIFIC',
    'UTC'
);



--
-- Name: gen_random_code(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION gen_random_code(length integer) RETURNS text
    LANGUAGE plpgsql
    AS $$
    DECLARE
        chars text[] := '{0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z}';
        result text := '';
        i integer := 0;
    BEGIN
        if length < 0 then
            raise exception 'Given length cannot be less than 0';
        end if;
        for i in 1..length loop
            result := result || chars[ceil(35 * random())];
        end loop;
        return result;
    END;
    $$;



SET search_path = storage, pg_catalog;

--
-- Name: accessible_databases(); Type: FUNCTION; Schema: storage; 
--

CREATE FUNCTION accessible_databases() RETURNS uuid[]
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    AS $$
    BEGIN
        RETURN ARRAY(
            SELECT database_id
            FROM storage.database_grants
            WHERE user_id = (
                SELECT user_id
                FROM storage.current_auth_token()
            )
        );
    END;
    $$;



--
-- Name: current_auth_token(); Type: FUNCTION; Schema: storage; 
--

CREATE FUNCTION current_auth_token(OUT id uuid, OUT audience text, OUT issuer text, OUT user_id uuid, OUT expires_at timestamp without time zone, OUT created_at timestamp without time zone) RETURNS record
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    AS $$
    BEGIN
        SELECT at.id, at.audience, at.issuer, at.user_id, at.expires_at, at.created_at
            INTO id, audience, issuer, user_id, expires_at, created_at
            FROM storage.auth_tokens at
            WHERE at.id = current_setting('storage.auth_token_id')::uuid
            AND at.secret = current_setting('storage.auth_token_secret')::uuid
            AND at.expires_at > now();
    EXCEPTION
        WHEN invalid_text_representation THEN RETURN;
        WHEN undefined_object THEN RETURN;
    END;
    $$;



--
-- Name: current_auth_token_id(); Type: FUNCTION; Schema: storage; 
--

CREATE FUNCTION current_auth_token_id() RETURNS uuid
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
        SELECT id FROM storage.current_auth_token()
    $$;



--
-- Name: current_external_task_auth_token(); Type: FUNCTION; Schema: storage; Owner: postgres
--

CREATE FUNCTION current_external_task_auth_token(OUT id uuid, OUT audience text, OUT issuer text, OUT external_task_id uuid, OUT expires_at timestamp without time zone, OUT created_at timestamp without time zone) RETURNS record
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    AS $$
    BEGIN
        SELECT at.id, at.audience, at.issuer, at.external_task_id, at.expires_at, at.created_at
            INTO id, audience, issuer, external_task_id, expires_at, created_at
            FROM storage.external_task_auth_tokens at
            WHERE at.id = current_setting('storage.external_task_auth_token_id')::uuid
            AND at.secret = current_setting('storage.external_task_auth_token_secret')::text
            AND at.expires_at > now();
    EXCEPTION
        WHEN invalid_text_representation THEN RETURN;
        WHEN undefined_object THEN RETURN;
    END;
    $$;



--
-- Name: current_external_task_id(); Type: FUNCTION; Schema: storage; Owner: postgres
--

CREATE FUNCTION current_external_task_id() RETURNS uuid
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
        SELECT external_task_id FROM storage.current_external_task_auth_token()
    $$;



--
-- Name: current_user_id(); Type: FUNCTION; Schema: storage; 
--

CREATE FUNCTION current_user_id() RETURNS uuid
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
        SELECT user_id FROM storage.current_auth_token()
    $$;



SET search_path = entity_graph, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: education_experiences; Type: TABLE; Schema: entity_graph; 
--

CREATE TABLE education_experiences (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    degrees jsonb DEFAULT '[]'::jsonb NOT NULL,
    end_date timestamp without time zone,
    is_current boolean,
    majors jsonb DEFAULT '[]'::jsonb NOT NULL,
    minors jsonb DEFAULT '[]'::jsonb NOT NULL,
    organization_id uuid NOT NULL,
    person_id uuid NOT NULL,
    start_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: emails; Type: TABLE; Schema: entity_graph; 
--

CREATE TABLE emails (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    address text NOT NULL,
    domain text,
    email_provider_id uuid,
    is_primary boolean,
    type text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
--
-- Name: emails_organizations; Type: TABLE; Schema: entity_graph; 
--

CREATE TABLE emails_organizations (
    email_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

--
-- Name: emails_people; Type: TABLE; Schema: entity_graph; 
--

CREATE TABLE emails_people (
    email_id uuid NOT NULL,
    person_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

--
-- Name: images; Type: TABLE; Schema: entity_graph; 
--

CREATE TABLE images (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    content_type text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    sha256 text,
    content_length integer NOT NULL,
    width integer DEFAULT 0 NOT NULL,
    height integer DEFAULT 0 NOT NULL
);

--
-- Name: images_organizations; Type: TABLE; Schema: entity_graph; 
--

CREATE TABLE images_organizations (
    image_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

--
-- Name: images_people; Type: TABLE; Schema: entity_graph; 
--

CREATE TABLE images_people (
    image_id uuid NOT NULL,
    person_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: industries; Type: TABLE; Schema: entity_graph; 
--

CREATE TABLE industries (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: industries_organizations; Type: TABLE; Schema: entity_graph; 
--

CREATE TABLE industries_organizations (
    industry_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: ip_addresses; Type: TABLE; Schema: entity_graph; Owner: postgres
--

CREATE TABLE ip_addresses (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    ip_address cidr NOT NULL,
    website_id uuid,
    location_id uuid,
    organization_id uuid,
    as_number integer,
    as_org_id uuid,
    isp_id uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
--
-- Name: languages; Type: TABLE; Schema: entity_graph; 
--

CREATE TABLE languages (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

--
-- Name: languages_people; Type: TABLE; Schema: entity_graph; 
--

CREATE TABLE languages_people (
    language_id uuid NOT NULL,
    person_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

--
-- Name: locations; Type: TABLE; Schema: entity_graph; 
--

CREATE TABLE locations (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text,
    continent text,
    country text,
    is_primary boolean,
    latitude text,
    locality text,
    longitude text,
    po_box text,
    postal_code text,
    region text,
    state text,
    street_address text,
    timezone text,
    type text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

--
-- Name: locations_organizations; Type: TABLE; Schema: entity_graph; 
--

CREATE TABLE locations_organizations (
    location_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

--
-- Name: locations_people; Type: TABLE; Schema: entity_graph; 
--

CREATE TABLE locations_people (
    location_id uuid NOT NULL,
    person_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: organizations; Type: TABLE; Schema: entity_graph; 
--

CREATE TABLE organizations (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    dbas jsonb DEFAULT '[]'::jsonb NOT NULL,
    alexa_global_rank integer,
    alexa_us_rank integer,
    description text,
    employee_count text,
    founding_date timestamp without time zone,
    legal_name text,
    market_cap integer,
    raised integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
--
-- Name: organizations_people; Type: TABLE; Schema: entity_graph; 
--

CREATE TABLE organizations_people (
    organization_id uuid NOT NULL,
    person_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

--
-- Name: organizations_phone_numbers; Type: TABLE; Schema: entity_graph; 
--

CREATE TABLE organizations_phone_numbers (
    organization_id uuid NOT NULL,
    phone_number_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: organizations_social_profiles; Type: TABLE; Schema: entity_graph; 
--

CREATE TABLE organizations_social_profiles (
    organization_id uuid NOT NULL,
    social_profile_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

--
-- Name: organizations_websites; Type: TABLE; Schema: entity_graph; 
--

CREATE TABLE organizations_websites (
    organization_id uuid NOT NULL,
    website_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

--
-- Name: people; Type: TABLE; Schema: entity_graph; 
--

CREATE TABLE people (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    date_of_birth timestamp without time zone,
    gender text,
    interests jsonb NOT NULL,
    skills jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

--
-- Name: people_phone_numbers; Type: TABLE; Schema: entity_graph; 
--

CREATE TABLE people_phone_numbers (
    person_id uuid NOT NULL,
    phone_number_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

--
-- Name: people_social_profiles; Type: TABLE; Schema: entity_graph; 
--

CREATE TABLE people_social_profiles (
    person_id uuid NOT NULL,
    social_profile_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

--
-- Name: people_websites; Type: TABLE; Schema: entity_graph; 
--

CREATE TABLE people_websites (
    person_id uuid NOT NULL,
    website_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

--
-- Name: person_names; Type: TABLE; Schema: entity_graph; 
--

CREATE TABLE person_names (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    first_name text,
    is_primary boolean,
    last_name text,
    middle_name text,
    person_id uuid NOT NULL,
    prefix text,
    suffix text,
    title text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

--
-- Name: phone_numbers; Type: TABLE; Schema: entity_graph; 
--

CREATE TABLE phone_numbers (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    area_code text,
    country_code text,
    extension text,
    number text NOT NULL,
    type text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);



--
-- Name: products; Type: TABLE; Schema: entity_graph; 
--

CREATE TABLE products (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    website_id uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: social_profiles; Type: TABLE; Schema: entity_graph; 
--

CREATE TABLE social_profiles (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    aliases jsonb DEFAULT '[]'::jsonb NOT NULL,
    bio text,
    followers integer,
    is_active boolean,
    network_id uuid,
    url text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

--
-- Name: websites; Type: TABLE; Schema: entity_graph; 
--

CREATE TABLE websites (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text,
    domain text,
    type text,
    url text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

--
-- Name: work_experiences; Type: TABLE; Schema: entity_graph; 
--

CREATE TABLE work_experiences (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    person_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

--
-- Name: work_roles; Type: TABLE; Schema: entity_graph; 
--

CREATE TABLE work_roles (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    title text,
    end_date timestamp without time zone,
    is_current boolean,
    start_date timestamp without time zone,
    work_experience_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

SET search_path = storage, pg_catalog;

--
-- Name: actors; Type: TABLE; Schema: storage; Owner: postgres
--

CREATE TABLE actors (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    lookup_fields jsonb DEFAULT '{}'::jsonb NOT NULL,
    email_id uuid,
    person_id uuid,
    phone_number_id uuid,
    database_id uuid NOT NULL,
    ip_address_id uuid
);



--
-- Name: auth_tokens; Type: TABLE; Schema: storage; Owner: ec2-user
--

CREATE TABLE auth_tokens (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    audience text NOT NULL,
    issuer text NOT NULL,
    secret uuid DEFAULT public.gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);



--
-- Name: database_grants; Type: TABLE; Schema: storage; Owner: ec2-user
--

CREATE TABLE database_grants (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    permissions text NOT NULL,
    user_id uuid NOT NULL,
    database_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);



--
-- Name: databases; Type: TABLE; Schema: storage; Owner: ec2-user
--

CREATE TABLE databases (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    invite_code text DEFAULT public.gen_random_code(12) NOT NULL,
    invite_email_domains jsonb DEFAULT '[]'::jsonb NOT NULL,
    icon_image_id uuid,
    icon text DEFAULT 'business'::text NOT NULL
);



--
-- Name: decisions; Type: TABLE; Schema: storage; Owner: postgres
--

CREATE TABLE decisions (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    target_id uuid NOT NULL,
    label text,
    score text,
    reasons jsonb DEFAULT '[]'::jsonb NOT NULL,
    user_id uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    database_id uuid NOT NULL,
    external_task_id uuid,
    metadata jsonb
);



--
-- Name: external_task_auth_tokens; Type: TABLE; Schema: storage; Owner: postgres
--

CREATE TABLE external_task_auth_tokens (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    audience text NOT NULL,
    issuer text NOT NULL,
    secret text DEFAULT public.gen_random_code(32) NOT NULL,
    external_task_id uuid NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);



--
-- Name: external_task_types; Type: TABLE; Schema: storage; Owner: postgres
--

CREATE TABLE external_task_types (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    workflow_id uuid NOT NULL,
    service text DEFAULT 'MTURK'::text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    instructions text DEFAULT ''::text NOT NULL,
    create_labels jsonb DEFAULT '[]'::jsonb NOT NULL,
    decision_labels jsonb DEFAULT '[]'::jsonb NOT NULL,
    reward text DEFAULT '0.01'::text NOT NULL,
    keywords jsonb DEFAULT '[]'::jsonb NOT NULL,
    assignment_duration integer DEFAULT 3600 NOT NULL,
    autoapproval_delay integer DEFAULT 86400 NOT NULL,
    lifetime integer DEFAULT 86400 NOT NULL,
    max_assignments integer DEFAULT 1 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    example_groups jsonb DEFAULT '[]'::jsonb NOT NULL
);



--
-- Name: external_tasks; Type: TABLE; Schema: storage; Owner: postgres
--

CREATE TABLE external_tasks (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    database_id uuid NOT NULL,
    type_id uuid NOT NULL,
    target_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);



--
-- Name: targets; Type: TABLE; Schema: storage; Owner: postgres
--

CREATE TABLE targets (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    workflow_id uuid NOT NULL,
    actor_id uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    database_id uuid NOT NULL,
    label text DEFAULT 'PENDING'::text NOT NULL,
    score numeric,
    reasons jsonb DEFAULT '[]'::jsonb NOT NULL,
    display text,
    image_id uuid,
    state jsonb,
    key jsonb DEFAULT json_build_array(public.gen_random_code(32)) NOT NULL,
    environment text DEFAULT 'LIVE'::text NOT NULL,
    aliases jsonb DEFAULT '[]'::jsonb NOT NULL
);



--
-- Name: updates; Type: TABLE; Schema: storage; Owner: postgres
--

CREATE TABLE updates (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    database_id uuid NOT NULL,
    target_id uuid NOT NULL,
    label text DEFAULT ''::text NOT NULL,
    score numeric,
    reasons jsonb DEFAULT '[]'::jsonb NOT NULL,
    state jsonb,
    webhook_status integer,
    webhook_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    aliases jsonb DEFAULT '[]'::jsonb NOT NULL
);



--
-- Name: users; Type: TABLE; Schema: storage; Owner: ec2-user
--

CREATE TABLE users (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    username text NOT NULL,
    password_hash text NOT NULL,
    password_salt text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    default_database_id uuid,
    primary_email text DEFAULT 'admin@cleargraph.com'::text NOT NULL,
    email_verified boolean DEFAULT false NOT NULL,
    email_verification_code text DEFAULT public.gen_random_code(32) NOT NULL,
    email_verification_code_created_at timestamp without time zone DEFAULT now() NOT NULL,
    preferred_name text DEFAULT ''::text NOT NULL,
    icon_image_id uuid,
    icon text DEFAULT 'user'::text NOT NULL
);



--
-- Name: workflow_settings; Type: TABLE; Schema: storage; Owner: postgres
--

CREATE TABLE workflow_settings (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    database_id uuid NOT NULL,
    workflow_id uuid NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    update_webhook_url text DEFAULT ''::text NOT NULL,
    update_webhook_secret text DEFAULT public.gen_random_code(16) NOT NULL,
    run_token text DEFAULT public.gen_random_code(32) NOT NULL,
    environment text DEFAULT 'LIVE'::text NOT NULL
);



--
-- Name: workflows; Type: TABLE; Schema: storage; Owner: postgres
--

CREATE TABLE workflows (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    function_url text DEFAULT 'https://us-central1-pavlov-mono.cloudfunctions.net/coin-toss'::text NOT NULL,
    possible_labels jsonb DEFAULT '[]'::jsonb NOT NULL,
    inbox_labels jsonb DEFAULT '[]'::jsonb NOT NULL,
    drawer_labels jsonb DEFAULT '[]'::jsonb NOT NULL,
    image_target_arity public.target_arity DEFAULT 'NONE'::public.target_arity NOT NULL,
    actor_target_arity public.target_arity DEFAULT 'NONE'::public.target_arity NOT NULL,
    function_data_query text DEFAULT ''::text NOT NULL,
    update_data_query text,
    icon_image_id uuid,
    icon text DEFAULT 'workflow'::text NOT NULL
);


SET search_path = entity_graph, pg_catalog;

--
-- Name: education_experiences education_experiences_pkey; Type: CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY education_experiences
    ADD CONSTRAINT education_experiences_pkey PRIMARY KEY (id);


--
-- Name: emails emails_address_unique; Type: CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY emails
    ADD CONSTRAINT emails_address_unique UNIQUE (address);


--
-- Name: emails emails_pkey; Type: CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY emails
    ADD CONSTRAINT emails_pkey PRIMARY KEY (id);


--
-- Name: images images_pkey; Type: CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- Name: images images_sha256_unique; Type: CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY images
    ADD CONSTRAINT images_sha256_unique UNIQUE (sha256);


--
-- Name: industries industries_name_unique; Type: CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY industries
    ADD CONSTRAINT industries_name_unique UNIQUE (name);


--
-- Name: industries industries_pkey; Type: CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY industries
    ADD CONSTRAINT industries_pkey PRIMARY KEY (id);


--
-- Name: ip_addresses ip_address_ip_unique; Type: CONSTRAINT; Schema: entity_graph; Owner: postgres
--

ALTER TABLE ONLY ip_addresses
    ADD CONSTRAINT ip_address_ip_unique UNIQUE (ip_address);


--
-- Name: ip_addresses ip_addresses_ip_address_key; Type: CONSTRAINT; Schema: entity_graph; Owner: postgres
--

ALTER TABLE ONLY ip_addresses
    ADD CONSTRAINT ip_addresses_ip_address_key UNIQUE (ip_address);


--
-- Name: ip_addresses ip_addresses_pkey; Type: CONSTRAINT; Schema: entity_graph; Owner: postgres
--

ALTER TABLE ONLY ip_addresses
    ADD CONSTRAINT ip_addresses_pkey PRIMARY KEY (id);


--
-- Name: languages languages_name_unique; Type: CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY languages
    ADD CONSTRAINT languages_name_unique UNIQUE (name);


--
-- Name: languages languages_pkey; Type: CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY languages
    ADD CONSTRAINT languages_pkey PRIMARY KEY (id);


--
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- Name: organizations organizations_pkey; Type: CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- Name: person_names people_names_pkey; Type: CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY person_names
    ADD CONSTRAINT people_names_pkey PRIMARY KEY (id);


--
-- Name: people people_pkey; Type: CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY people
    ADD CONSTRAINT people_pkey PRIMARY KEY (id);


--
-- Name: phone_numbers phone_number_number_unique; Type: CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY phone_numbers
    ADD CONSTRAINT phone_number_number_unique UNIQUE (number);


--
-- Name: phone_numbers phone_numbers_pkey; Type: CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY phone_numbers
    ADD CONSTRAINT phone_numbers_pkey PRIMARY KEY (id);


--
-- Name: products products_name_unique; Type: CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY products
    ADD CONSTRAINT products_name_unique UNIQUE (name);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: social_profiles social_profiles_pkey; Type: CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY social_profiles
    ADD CONSTRAINT social_profiles_pkey PRIMARY KEY (id);


--
-- Name: websites websites_pkey; Type: CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY websites
    ADD CONSTRAINT websites_pkey PRIMARY KEY (id);


--
-- Name: websites websites_url_unique; Type: CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY websites
    ADD CONSTRAINT websites_url_unique UNIQUE (url);


--
-- Name: work_experiences work_experiences_pkey; Type: CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY work_experiences
    ADD CONSTRAINT work_experiences_pkey PRIMARY KEY (id);


--
-- Name: work_roles work_roles_pkey; Type: CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY work_roles
    ADD CONSTRAINT work_roles_pkey PRIMARY KEY (id);


SET search_path = storage, pg_catalog;

--
-- Name: actors actors_pkey; Type: CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY actors
    ADD CONSTRAINT actors_pkey PRIMARY KEY (id);


--
-- Name: auth_tokens auth_tokens_pkey; Type: CONSTRAINT; Schema: storage; Owner: ec2-user
--

ALTER TABLE ONLY auth_tokens
    ADD CONSTRAINT auth_tokens_pkey PRIMARY KEY (id);


--
-- Name: database_grants database_grants_pkey; Type: CONSTRAINT; Schema: storage; Owner: ec2-user
--

ALTER TABLE ONLY database_grants
    ADD CONSTRAINT database_grants_pkey PRIMARY KEY (id);


--
-- Name: databases databases_invite_code_key; Type: CONSTRAINT; Schema: storage; Owner: ec2-user
--

ALTER TABLE ONLY databases
    ADD CONSTRAINT databases_invite_code_key UNIQUE (invite_code);


--
-- Name: databases databases_pkey; Type: CONSTRAINT; Schema: storage; Owner: ec2-user
--

ALTER TABLE ONLY databases
    ADD CONSTRAINT databases_pkey PRIMARY KEY (id);


--
-- Name: decisions decisions_pkey; Type: CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY decisions
    ADD CONSTRAINT decisions_pkey PRIMARY KEY (id);


--
-- Name: external_task_types external_task_types_pkey; Type: CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY external_task_types
    ADD CONSTRAINT external_task_types_pkey PRIMARY KEY (id);


--
-- Name: external_tasks external_tasks_pkey; Type: CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY external_tasks
    ADD CONSTRAINT external_tasks_pkey PRIMARY KEY (id);


--
-- Name: targets target_key_unique; Type: CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY targets
    ADD CONSTRAINT target_key_unique UNIQUE (database_id, workflow_id, environment, key);


--
-- Name: updates updates_pkey; Type: CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY updates
    ADD CONSTRAINT updates_pkey PRIMARY KEY (id);


--
-- Name: users users_email_verification_code_key; Type: CONSTRAINT; Schema: storage; Owner: ec2-user
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_email_verification_code_key UNIQUE (email_verification_code);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: storage; Owner: ec2-user
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: storage; Owner: ec2-user
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: targets workflow_runs_pkey; Type: CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY targets
    ADD CONSTRAINT workflow_runs_pkey PRIMARY KEY (id);


--
-- Name: workflow_settings workflow_settings_database_env_unique; Type: CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY workflow_settings
    ADD CONSTRAINT workflow_settings_database_env_unique UNIQUE (database_id, workflow_id, environment);


--
-- Name: workflow_settings workflow_settings_production_run_token_key; Type: CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY workflow_settings
    ADD CONSTRAINT workflow_settings_production_run_token_key UNIQUE (run_token);


--
-- Name: workflows workflows_pkey; Type: CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY workflows
    ADD CONSTRAINT workflows_pkey PRIMARY KEY (id);


--
-- Name: decisions_target_id_created_at_idx; Type: INDEX; Schema: storage; Owner: postgres
--

CREATE INDEX decisions_target_id_created_at_idx ON decisions USING btree (target_id, created_at);


--
-- Name: target_image_id; Type: INDEX; Schema: storage; Owner: postgres
--

CREATE INDEX target_image_id ON targets USING btree (database_id, workflow_id, environment, image_id);


--
-- Name: updates_target_id_created_at_idx; Type: INDEX; Schema: storage; Owner: postgres
--

CREATE INDEX updates_target_id_created_at_idx ON updates USING btree (target_id, created_at);


SET search_path = entity_graph, pg_catalog;

--
-- Name: education_experiences education_experiences_organization_id_fk; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY education_experiences
    ADD CONSTRAINT education_experiences_organization_id_fk FOREIGN KEY (organization_id) REFERENCES organizations(id);


--
-- Name: education_experiences education_experiences_person_id_fk; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY education_experiences
    ADD CONSTRAINT education_experiences_person_id_fk FOREIGN KEY (person_id) REFERENCES people(id);


--
-- Name: emails email_provider_product_fk; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY emails
    ADD CONSTRAINT email_provider_product_fk FOREIGN KEY (email_provider_id) REFERENCES products(id);


--
-- Name: emails_organizations emails_organizations_email_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY emails_organizations
    ADD CONSTRAINT emails_organizations_email_id FOREIGN KEY (email_id) REFERENCES emails(id);


--
-- Name: emails_organizations emails_organizations_organization_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY emails_organizations
    ADD CONSTRAINT emails_organizations_organization_id FOREIGN KEY (organization_id) REFERENCES organizations(id);


--
-- Name: emails_people emails_people_email_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY emails_people
    ADD CONSTRAINT emails_people_email_id FOREIGN KEY (email_id) REFERENCES emails(id);


--
-- Name: emails_people emails_people_person_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY emails_people
    ADD CONSTRAINT emails_people_person_id FOREIGN KEY (person_id) REFERENCES people(id);


--
-- Name: images_organizations images_organizations_image_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY images_organizations
    ADD CONSTRAINT images_organizations_image_id FOREIGN KEY (image_id) REFERENCES images(id);


--
-- Name: images_organizations images_organizations_organization_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY images_organizations
    ADD CONSTRAINT images_organizations_organization_id FOREIGN KEY (organization_id) REFERENCES organizations(id);


--
-- Name: images_people images_people_image_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY images_people
    ADD CONSTRAINT images_people_image_id FOREIGN KEY (image_id) REFERENCES images(id);


--
-- Name: images_people images_people_person_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY images_people
    ADD CONSTRAINT images_people_person_id FOREIGN KEY (person_id) REFERENCES people(id);


--
-- Name: industries_organizations industries_organizations_industry_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY industries_organizations
    ADD CONSTRAINT industries_organizations_industry_id FOREIGN KEY (industry_id) REFERENCES industries(id);


--
-- Name: industries_organizations industries_organizations_organization_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY industries_organizations
    ADD CONSTRAINT industries_organizations_organization_id FOREIGN KEY (organization_id) REFERENCES organizations(id);


--
-- Name: ip_addresses ip_addresses_as_org_id_fkey; Type: FK CONSTRAINT; Schema: entity_graph; Owner: postgres
--

ALTER TABLE ONLY ip_addresses
    ADD CONSTRAINT ip_addresses_as_org_id_fkey FOREIGN KEY (as_org_id) REFERENCES organizations(id);


--
-- Name: ip_addresses ip_addresses_isp_id_fkey; Type: FK CONSTRAINT; Schema: entity_graph; Owner: postgres
--

ALTER TABLE ONLY ip_addresses
    ADD CONSTRAINT ip_addresses_isp_id_fkey FOREIGN KEY (isp_id) REFERENCES organizations(id);


--
-- Name: ip_addresses ip_addresses_location_id_fkey; Type: FK CONSTRAINT; Schema: entity_graph; Owner: postgres
--

ALTER TABLE ONLY ip_addresses
    ADD CONSTRAINT ip_addresses_location_id_fkey FOREIGN KEY (location_id) REFERENCES locations(id);


--
-- Name: ip_addresses ip_addresses_organization_id_fkey; Type: FK CONSTRAINT; Schema: entity_graph; Owner: postgres
--

ALTER TABLE ONLY ip_addresses
    ADD CONSTRAINT ip_addresses_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES organizations(id);


--
-- Name: ip_addresses ip_addresses_website_id_fkey; Type: FK CONSTRAINT; Schema: entity_graph; Owner: postgres
--

ALTER TABLE ONLY ip_addresses
    ADD CONSTRAINT ip_addresses_website_id_fkey FOREIGN KEY (website_id) REFERENCES websites(id);


--
-- Name: languages_people languages_people_language_id_fkey; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY languages_people
    ADD CONSTRAINT languages_people_language_id_fkey FOREIGN KEY (language_id) REFERENCES languages(id);


--
-- Name: languages_people languages_people_people_id_fkey; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY languages_people
    ADD CONSTRAINT languages_people_people_id_fkey FOREIGN KEY (person_id) REFERENCES people(id);


--
-- Name: locations_organizations locations_organizations_location_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY locations_organizations
    ADD CONSTRAINT locations_organizations_location_id FOREIGN KEY (location_id) REFERENCES locations(id);


--
-- Name: locations_organizations locations_organizations_organization_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY locations_organizations
    ADD CONSTRAINT locations_organizations_organization_id FOREIGN KEY (organization_id) REFERENCES organizations(id);


--
-- Name: locations_people locations_people_location_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY locations_people
    ADD CONSTRAINT locations_people_location_id FOREIGN KEY (location_id) REFERENCES locations(id);


--
-- Name: locations_people locations_people_person_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY locations_people
    ADD CONSTRAINT locations_people_person_id FOREIGN KEY (person_id) REFERENCES people(id);


--
-- Name: organizations_people organizations_people_organization_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY organizations_people
    ADD CONSTRAINT organizations_people_organization_id FOREIGN KEY (organization_id) REFERENCES organizations(id);


--
-- Name: organizations_people organizations_people_person_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY organizations_people
    ADD CONSTRAINT organizations_people_person_id FOREIGN KEY (person_id) REFERENCES people(id);


--
-- Name: organizations_phone_numbers organizations_phone_numbers_organization_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY organizations_phone_numbers
    ADD CONSTRAINT organizations_phone_numbers_organization_id FOREIGN KEY (organization_id) REFERENCES organizations(id);


--
-- Name: organizations_phone_numbers organizations_phone_numbers_phone_number_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY organizations_phone_numbers
    ADD CONSTRAINT organizations_phone_numbers_phone_number_id FOREIGN KEY (phone_number_id) REFERENCES phone_numbers(id);


--
-- Name: organizations_social_profiles organizations_social_profiles_organization_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY organizations_social_profiles
    ADD CONSTRAINT organizations_social_profiles_organization_id FOREIGN KEY (organization_id) REFERENCES organizations(id);


--
-- Name: organizations_social_profiles organizations_social_profiles_social_profile_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY organizations_social_profiles
    ADD CONSTRAINT organizations_social_profiles_social_profile_id FOREIGN KEY (social_profile_id) REFERENCES social_profiles(id);


--
-- Name: organizations_websites organizations_websites_organization_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY organizations_websites
    ADD CONSTRAINT organizations_websites_organization_id FOREIGN KEY (organization_id) REFERENCES organizations(id);


--
-- Name: organizations_websites organizations_websites_website_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY organizations_websites
    ADD CONSTRAINT organizations_websites_website_id FOREIGN KEY (website_id) REFERENCES websites(id);


--
-- Name: people_phone_numbers people_phone_numbers_person_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY people_phone_numbers
    ADD CONSTRAINT people_phone_numbers_person_id FOREIGN KEY (person_id) REFERENCES people(id);


--
-- Name: people_phone_numbers people_phone_numbers_phone_number_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY people_phone_numbers
    ADD CONSTRAINT people_phone_numbers_phone_number_id FOREIGN KEY (phone_number_id) REFERENCES phone_numbers(id);


--
-- Name: people_social_profiles people_social_profiles_person_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY people_social_profiles
    ADD CONSTRAINT people_social_profiles_person_id FOREIGN KEY (person_id) REFERENCES people(id);


--
-- Name: people_social_profiles people_social_profiles_social_profile_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY people_social_profiles
    ADD CONSTRAINT people_social_profiles_social_profile_id FOREIGN KEY (social_profile_id) REFERENCES social_profiles(id);


--
-- Name: people_websites people_websites_person_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY people_websites
    ADD CONSTRAINT people_websites_person_id FOREIGN KEY (person_id) REFERENCES people(id);


--
-- Name: people_websites people_websites_website_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY people_websites
    ADD CONSTRAINT people_websites_website_id FOREIGN KEY (website_id) REFERENCES websites(id);


--
-- Name: person_names person_names_people_fk; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY person_names
    ADD CONSTRAINT person_names_people_fk FOREIGN KEY (person_id) REFERENCES people(id);


--
-- Name: social_profiles social_profiles_network_id_fk; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY social_profiles
    ADD CONSTRAINT social_profiles_network_id_fk FOREIGN KEY (network_id) REFERENCES products(id);


--
-- Name: work_experiences work_experiences_organization_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY work_experiences
    ADD CONSTRAINT work_experiences_organization_id FOREIGN KEY (organization_id) REFERENCES organizations(id);


--
-- Name: work_experiences work_experiences_person_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY work_experiences
    ADD CONSTRAINT work_experiences_person_id FOREIGN KEY (person_id) REFERENCES people(id);


--
-- Name: work_roles work_roles_work_experiences_id; Type: FK CONSTRAINT; Schema: entity_graph; 
--

ALTER TABLE ONLY work_roles
    ADD CONSTRAINT work_roles_work_experiences_id FOREIGN KEY (work_experience_id) REFERENCES work_experiences(id);


SET search_path = storage, pg_catalog;

--
-- Name: actors actors_database_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY actors
    ADD CONSTRAINT actors_database_id_fkey FOREIGN KEY (database_id) REFERENCES databases(id);


--
-- Name: actors actors_email_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY actors
    ADD CONSTRAINT actors_email_id_fkey FOREIGN KEY (email_id) REFERENCES entity_graph.emails(id);


--
-- Name: actors actors_ip_address_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY actors
    ADD CONSTRAINT actors_ip_address_id_fkey FOREIGN KEY (ip_address_id) REFERENCES entity_graph.ip_addresses(id);


--
-- Name: actors actors_person_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY actors
    ADD CONSTRAINT actors_person_id_fkey FOREIGN KEY (person_id) REFERENCES entity_graph.people(id);


--
-- Name: actors actors_phone_number_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY actors
    ADD CONSTRAINT actors_phone_number_id_fkey FOREIGN KEY (phone_number_id) REFERENCES entity_graph.phone_numbers(id);


--
-- Name: auth_tokens auth_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: ec2-user
--

ALTER TABLE ONLY auth_tokens
    ADD CONSTRAINT auth_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;


--
-- Name: database_grants database_grants_database_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: ec2-user
--

ALTER TABLE ONLY database_grants
    ADD CONSTRAINT database_grants_database_id_fkey FOREIGN KEY (database_id) REFERENCES databases(id) ON DELETE CASCADE;


--
-- Name: database_grants database_grants_user_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: ec2-user
--

ALTER TABLE ONLY database_grants
    ADD CONSTRAINT database_grants_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;


--
-- Name: databases databases_icon_image_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: ec2-user
--

ALTER TABLE ONLY databases
    ADD CONSTRAINT databases_icon_image_id_fkey FOREIGN KEY (icon_image_id) REFERENCES entity_graph.images(id);


--
-- Name: decisions decisions_database_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY decisions
    ADD CONSTRAINT decisions_database_id_fkey FOREIGN KEY (database_id) REFERENCES databases(id);


--
-- Name: decisions decisions_external_task_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY decisions
    ADD CONSTRAINT decisions_external_task_id_fkey FOREIGN KEY (external_task_id) REFERENCES external_tasks(id) ON DELETE CASCADE;


--
-- Name: decisions decisions_run_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY decisions
    ADD CONSTRAINT decisions_run_id_fkey FOREIGN KEY (target_id) REFERENCES targets(id);


--
-- Name: decisions decisions_user_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY decisions
    ADD CONSTRAINT decisions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: external_task_auth_tokens external_task_auth_tokens_external_task_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY external_task_auth_tokens
    ADD CONSTRAINT external_task_auth_tokens_external_task_id_fkey FOREIGN KEY (external_task_id) REFERENCES external_tasks(id);


--
-- Name: external_task_types external_task_types_workflow_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY external_task_types
    ADD CONSTRAINT external_task_types_workflow_id_fkey FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE;


--
-- Name: external_tasks external_tasks_database_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY external_tasks
    ADD CONSTRAINT external_tasks_database_id_fkey FOREIGN KEY (database_id) REFERENCES databases(id) ON DELETE CASCADE;


--
-- Name: external_tasks external_tasks_target_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY external_tasks
    ADD CONSTRAINT external_tasks_target_id_fkey FOREIGN KEY (target_id) REFERENCES targets(id) ON DELETE CASCADE;


--
-- Name: external_tasks external_tasks_type_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY external_tasks
    ADD CONSTRAINT external_tasks_type_id_fkey FOREIGN KEY (type_id) REFERENCES external_task_types(id) ON DELETE CASCADE;


--
-- Name: updates updates_database_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY updates
    ADD CONSTRAINT updates_database_id_fkey FOREIGN KEY (database_id) REFERENCES databases(id);


--
-- Name: updates updates_target_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY updates
    ADD CONSTRAINT updates_target_id_fkey FOREIGN KEY (target_id) REFERENCES targets(id);


--
-- Name: users users_default_database_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: ec2-user
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_default_database_id_fkey FOREIGN KEY (default_database_id) REFERENCES databases(id);


--
-- Name: users users_icon_image_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: ec2-user
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_icon_image_id_fkey FOREIGN KEY (icon_image_id) REFERENCES entity_graph.images(id);


--
-- Name: targets workflow_runs_actor_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY targets
    ADD CONSTRAINT workflow_runs_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES actors(id);


--
-- Name: targets workflow_runs_database_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY targets
    ADD CONSTRAINT workflow_runs_database_id_fkey FOREIGN KEY (database_id) REFERENCES databases(id);


--
-- Name: targets workflow_runs_image_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY targets
    ADD CONSTRAINT workflow_runs_image_id_fkey FOREIGN KEY (image_id) REFERENCES entity_graph.images(id);


--
-- Name: targets workflow_runs_workflow_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY targets
    ADD CONSTRAINT workflow_runs_workflow_id_fkey FOREIGN KEY (workflow_id) REFERENCES workflows(id);


--
-- Name: workflow_settings workflow_settings_database_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY workflow_settings
    ADD CONSTRAINT workflow_settings_database_id_fkey FOREIGN KEY (database_id) REFERENCES databases(id);


--
-- Name: workflow_settings workflow_settings_workflow_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY workflow_settings
    ADD CONSTRAINT workflow_settings_workflow_id_fkey FOREIGN KEY (workflow_id) REFERENCES workflows(id);


--
-- Name: workflows workflows_icon_image_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: postgres
--

ALTER TABLE ONLY workflows
    ADD CONSTRAINT workflows_icon_image_id_fkey FOREIGN KEY (icon_image_id) REFERENCES entity_graph.images(id);


--
-- Name: actors; Type: ROW SECURITY; Schema: storage; Owner: postgres
--

ALTER TABLE actors ENABLE ROW LEVEL SECURITY;

--
-- Name: actors actors_sandbox; Type: POLICY; Schema: storage; Owner: postgres
--

CREATE POLICY actors_sandbox ON actors FOR ALL TO sandbox USING ((database_id = ANY (accessible_databases())));


--
-- Name: auth_tokens; Type: ROW SECURITY; Schema: storage; Owner: ec2-user
--

ALTER TABLE auth_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: auth_tokens auth_tokens_sandbox; Type: POLICY; Schema: storage; Owner: ec2-user
--

CREATE POLICY auth_tokens_sandbox ON auth_tokens FOR ALL TO sandbox USING ((user_id = current_user_id())) WITH CHECK (true);


--
-- Name: databases; Type: ROW SECURITY; Schema: storage; Owner: ec2-user
--

ALTER TABLE databases ENABLE ROW LEVEL SECURITY;

--
-- Name: databases databases_sandbox; Type: POLICY; Schema: storage; Owner: ec2-user
--

CREATE POLICY databases_sandbox ON databases FOR ALL TO sandbox USING ((id = ANY (accessible_databases()))) WITH CHECK (true);


--
-- Name: decisions; Type: ROW SECURITY; Schema: storage; Owner: postgres
--

ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;

--
-- Name: decisions decisions_sandbox; Type: POLICY; Schema: storage; Owner: postgres
--

CREATE POLICY decisions_sandbox ON decisions FOR ALL TO sandbox USING ((database_id = ANY (accessible_databases())));


--
-- Name: external_tasks external_task_sandbox_external_tasks; Type: POLICY; Schema: storage; Owner: postgres
--

CREATE POLICY external_task_sandbox_external_tasks ON external_tasks FOR ALL TO sandbox USING ((id = current_external_task_id())) WITH CHECK (true);


--
-- Name: targets; Type: ROW SECURITY; Schema: storage; Owner: postgres
--

ALTER TABLE targets ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: storage; Owner: ec2-user
--

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

--
-- Name: users users_sandbox; Type: POLICY; Schema: storage; Owner: ec2-user
--

CREATE POLICY users_sandbox ON users FOR ALL TO sandbox USING ((id = current_user_id())) WITH CHECK (true);


--
-- Name: targets workflow_runs_sandbox; Type: POLICY; Schema: storage; Owner: postgres
--

CREATE POLICY workflow_runs_sandbox ON targets FOR ALL TO sandbox USING ((database_id = ANY (accessible_databases())));


--
-- Name: workflows; Type: ROW SECURITY; Schema: storage; Owner: postgres
--

ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;

--
-- Name: workflows workflows_sandbox; Type: POLICY; Schema: storage; Owner: postgres
--

CREATE POLICY workflows_sandbox ON workflows FOR ALL TO sandbox USING (true);


--
-- Name: entity_graph; Type: ACL; Schema: -; 
--

GRANT USAGE ON SCHEMA entity_graph TO sandbox_r;
GRANT USAGE ON SCHEMA entity_graph TO console;
GRANT USAGE ON SCHEMA entity_graph TO sandbox_rw;
GRANT USAGE ON SCHEMA entity_graph TO sandbox;


--
-- Name: storage; Type: ACL; Schema: -; Owner: ec2-user
--

GRANT USAGE ON SCHEMA storage TO sandbox;
GRANT USAGE ON SCHEMA storage TO console;


--
-- Name: accessible_databases(); Type: ACL; Schema: storage; 
--

GRANT ALL ON FUNCTION accessible_databases() TO console;
GRANT ALL ON FUNCTION accessible_databases() TO sandbox;


--
-- Name: current_auth_token(); Type: ACL; Schema: storage; 
--

GRANT ALL ON FUNCTION current_auth_token(OUT id uuid, OUT audience text, OUT issuer text, OUT user_id uuid, OUT expires_at timestamp without time zone, OUT created_at timestamp without time zone) TO console;
GRANT ALL ON FUNCTION current_auth_token(OUT id uuid, OUT audience text, OUT issuer text, OUT user_id uuid, OUT expires_at timestamp without time zone, OUT created_at timestamp without time zone) TO sandbox;


--
-- Name: current_auth_token_id(); Type: ACL; Schema: storage; 
--

GRANT ALL ON FUNCTION current_auth_token_id() TO console;
GRANT ALL ON FUNCTION current_auth_token_id() TO sandbox;


--
-- Name: current_user_id(); Type: ACL; Schema: storage; 
--

GRANT ALL ON FUNCTION current_user_id() TO console;
GRANT ALL ON FUNCTION current_user_id() TO sandbox;


SET search_path = entity_graph, pg_catalog;

--
-- Name: education_experiences; Type: ACL; Schema: entity_graph; 
--

GRANT ALL ON TABLE education_experiences TO sandbox_rw;
GRANT ALL ON TABLE education_experiences TO console;


--
-- Name: emails; Type: ACL; Schema: entity_graph; 
--

GRANT ALL ON TABLE emails TO sandbox_rw;
GRANT ALL ON TABLE emails TO console;


--
-- Name: emails_organizations; Type: ACL; Schema: entity_graph; 
--

GRANT ALL ON TABLE emails_organizations TO sandbox_rw;
GRANT ALL ON TABLE emails_organizations TO console;


--
-- Name: emails_people; Type: ACL; Schema: entity_graph; 
--

GRANT ALL ON TABLE emails_people TO sandbox_rw;
GRANT ALL ON TABLE emails_people TO console;


--
-- Name: images; Type: ACL; Schema: entity_graph; 
--

GRANT ALL ON TABLE images TO sandbox_rw;
GRANT ALL ON TABLE images TO console;
GRANT SELECT ON TABLE images TO external_task_sandbox;


--
-- Name: images_organizations; Type: ACL; Schema: entity_graph; 
--

GRANT ALL ON TABLE images_organizations TO sandbox_rw;
GRANT ALL ON TABLE images_organizations TO console;


--
-- Name: images_people; Type: ACL; Schema: entity_graph; 
--

GRANT ALL ON TABLE images_people TO sandbox_rw;
GRANT ALL ON TABLE images_people TO console;


--
-- Name: industries; Type: ACL; Schema: entity_graph; 
--

GRANT ALL ON TABLE industries TO sandbox_rw;
GRANT ALL ON TABLE industries TO console;


--
-- Name: industries_organizations; Type: ACL; Schema: entity_graph; 
--

GRANT ALL ON TABLE industries_organizations TO sandbox_rw;
GRANT ALL ON TABLE industries_organizations TO console;


--
-- Name: ip_addresses; Type: ACL; Schema: entity_graph; Owner: postgres
--

GRANT ALL ON TABLE ip_addresses TO console;


--
-- Name: languages; Type: ACL; Schema: entity_graph; 
--

GRANT ALL ON TABLE languages TO sandbox_rw;
GRANT ALL ON TABLE languages TO console;


--
-- Name: languages_people; Type: ACL; Schema: entity_graph; 
--

GRANT ALL ON TABLE languages_people TO sandbox_rw;
GRANT ALL ON TABLE languages_people TO console;


--
-- Name: locations; Type: ACL; Schema: entity_graph; 
--

GRANT ALL ON TABLE locations TO sandbox_rw;
GRANT ALL ON TABLE locations TO console;


--
-- Name: locations_organizations; Type: ACL; Schema: entity_graph; 
--

GRANT ALL ON TABLE locations_organizations TO sandbox_rw;
GRANT ALL ON TABLE locations_organizations TO console;


--
-- Name: locations_people; Type: ACL; Schema: entity_graph; 
--

GRANT ALL ON TABLE locations_people TO sandbox_rw;
GRANT ALL ON TABLE locations_people TO console;


--
-- Name: organizations; Type: ACL; Schema: entity_graph; 
--

GRANT ALL ON TABLE organizations TO sandbox_rw;
GRANT ALL ON TABLE organizations TO console;


--
-- Name: organizations_people; Type: ACL; Schema: entity_graph; 
--

GRANT ALL ON TABLE organizations_people TO sandbox_rw;
GRANT ALL ON TABLE organizations_people TO console;


--
-- Name: organizations_phone_numbers; Type: ACL; Schema: entity_graph; 
--

GRANT ALL ON TABLE organizations_phone_numbers TO sandbox_rw;
GRANT ALL ON TABLE organizations_phone_numbers TO console;


--
-- Name: organizations_social_profiles; Type: ACL; Schema: entity_graph; 
--

GRANT ALL ON TABLE organizations_social_profiles TO sandbox_rw;
GRANT ALL ON TABLE organizations_social_profiles TO console;


--
-- Name: organizations_websites; Type: ACL; Schema: entity_graph; 
--

GRANT ALL ON TABLE organizations_websites TO sandbox_rw;
GRANT ALL ON TABLE organizations_websites TO console;


--
-- Name: people; Type: ACL; Schema: entity_graph; 
--

GRANT ALL ON TABLE people TO sandbox_rw;
GRANT ALL ON TABLE people TO console;


--
-- Name: people_phone_numbers; Type: ACL; Schema: entity_graph; 
--

GRANT ALL ON TABLE people_phone_numbers TO sandbox_rw;
GRANT ALL ON TABLE people_phone_numbers TO console;


--
-- Name: people_social_profiles; Type: ACL; Schema: entity_graph; 
--

GRANT ALL ON TABLE people_social_profiles TO sandbox_rw;
GRANT ALL ON TABLE people_social_profiles TO console;


--
-- Name: people_websites; Type: ACL; Schema: entity_graph; 
--

GRANT ALL ON TABLE people_websites TO sandbox_rw;
GRANT ALL ON TABLE people_websites TO console;


--
-- Name: person_names; Type: ACL; Schema: entity_graph; 
--

GRANT ALL ON TABLE person_names TO sandbox_rw;
GRANT ALL ON TABLE person_names TO console;


--
-- Name: phone_numbers; Type: ACL; Schema: entity_graph; 
--

GRANT ALL ON TABLE phone_numbers TO sandbox_rw;
GRANT ALL ON TABLE phone_numbers TO console;


--
-- Name: products; Type: ACL; Schema: entity_graph; 
--

GRANT ALL ON TABLE products TO sandbox_rw;
GRANT ALL ON TABLE products TO console;


--
-- Name: social_profiles; Type: ACL; Schema: entity_graph; 
--

GRANT ALL ON TABLE social_profiles TO sandbox_rw;
GRANT ALL ON TABLE social_profiles TO console;


--
-- Name: websites; Type: ACL; Schema: entity_graph; 
--

GRANT ALL ON TABLE websites TO sandbox_rw;
GRANT ALL ON TABLE websites TO console;


--
-- Name: work_experiences; Type: ACL; Schema: entity_graph; 
--

GRANT ALL ON TABLE work_experiences TO sandbox_rw;
GRANT ALL ON TABLE work_experiences TO console;


--
-- Name: work_roles; Type: ACL; Schema: entity_graph; 
--

GRANT ALL ON TABLE work_roles TO sandbox_rw;
GRANT ALL ON TABLE work_roles TO console;


SET search_path = storage, pg_catalog;

--
-- Name: actors; Type: ACL; Schema: storage; Owner: postgres
--

GRANT ALL ON TABLE actors TO sandbox_rw;
GRANT SELECT ON TABLE actors TO sandbox_r;
GRANT ALL ON TABLE actors TO console;


--
-- Name: auth_tokens; Type: ACL; Schema: storage; Owner: ec2-user
--

GRANT ALL ON TABLE auth_tokens TO console;
GRANT ALL ON TABLE auth_tokens TO sandbox_rw;


--
-- Name: database_grants; Type: ACL; Schema: storage; Owner: ec2-user
--

GRANT ALL ON TABLE database_grants TO console;
GRANT ALL ON TABLE database_grants TO sandbox_rw;


--
-- Name: databases; Type: ACL; Schema: storage; Owner: ec2-user
--

GRANT ALL ON TABLE databases TO console;
GRANT ALL ON TABLE databases TO sandbox_rw;
GRANT SELECT ON TABLE databases TO sandbox_r;


--
-- Name: decisions; Type: ACL; Schema: storage; Owner: postgres
--

GRANT ALL ON TABLE decisions TO sandbox_rw;
GRANT SELECT ON TABLE decisions TO sandbox_r;
GRANT ALL ON TABLE decisions TO console;


--
-- Name: external_task_auth_tokens; Type: ACL; Schema: storage; Owner: postgres
--

GRANT ALL ON TABLE external_task_auth_tokens TO console;


--
-- Name: external_task_types; Type: ACL; Schema: storage; Owner: postgres
--

GRANT ALL ON TABLE external_task_types TO sandbox_rw;
GRANT SELECT ON TABLE external_task_types TO sandbox_r;
GRANT ALL ON TABLE external_task_types TO console;


--
-- Name: external_tasks; Type: ACL; Schema: storage; Owner: postgres
--

GRANT ALL ON TABLE external_tasks TO sandbox_rw;
GRANT SELECT ON TABLE external_tasks TO sandbox_r;
GRANT ALL ON TABLE external_tasks TO console;
GRANT SELECT ON TABLE external_tasks TO external_task_sandbox;


--
-- Name: targets; Type: ACL; Schema: storage; Owner: postgres
--

GRANT ALL ON TABLE targets TO sandbox_rw;
GRANT SELECT ON TABLE targets TO sandbox_r;
GRANT ALL ON TABLE targets TO console;


--
-- Name: updates; Type: ACL; Schema: storage; Owner: postgres
--

GRANT ALL ON TABLE updates TO sandbox_rw;
GRANT ALL ON TABLE updates TO console;


--
-- Name: users; Type: ACL; Schema: storage; Owner: ec2-user
--

GRANT ALL ON TABLE users TO console;
GRANT ALL ON TABLE users TO sandbox_rw;


--
-- Name: workflow_settings; Type: ACL; Schema: storage; Owner: postgres
--

GRANT ALL ON TABLE workflow_settings TO sandbox_rw;
GRANT ALL ON TABLE workflow_settings TO console;


--
-- Name: workflows; Type: ACL; Schema: storage; Owner: postgres
--

GRANT ALL ON TABLE workflows TO sandbox_rw;
GRANT SELECT ON TABLE workflows TO sandbox_r;
GRANT ALL ON TABLE workflows TO console;

SET search_path = public, pg_catalog;

COMMIT;
