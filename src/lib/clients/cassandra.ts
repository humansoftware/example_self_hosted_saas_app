import cassandra from 'cassandra-driver';

let cachedCassandraClient: cassandra.Client | null = null;

export function createCassandraClient(): cassandra.Client {
    if (cachedCassandraClient) return cachedCassandraClient;

    cachedCassandraClient = new cassandra.Client({
        contactPoints: [process.env.CASSANDRA_HOST || 'localhost'],
        localDataCenter: process.env.CASSANDRA_DC || 'datacenter1',
        credentials: {
            username: process.env.CASSANDRA_USER || '',
            password: process.env.CASSANDRA_PASSWORD || '',
        },
        keyspace: process.env.CASSANDRA_KEYSPACE,
    });

    return cachedCassandraClient;
}

export default createCassandraClient;
