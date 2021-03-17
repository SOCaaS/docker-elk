# Agent Service Index Queries

## Index Mappings
```
PUT /agent-index
{
  "mappings" : {
   "properties": {
      "name": {
        "type": "keyword"
      },
      "active" : {
        "type" : "boolean"
      },
      "interface" : {
        "type" : "keyword"
      },
      "interfaces" : {
        "type" : "keyword"
      },
      "ip" : {
        "type" : "ip"
      },
      "services" : {
        "properties": {
          "tshark": {
            "properties": {
              "active" : {
                "type" : "boolean"
              },
              "rules" : {
                "type": "nested",
                "properties" : {
                  "id": {
                    "type" : "integer"
                  },
                  "details" : {
                    "type" : "text"
                  },
                  "active" : {
                    "type" : "boolean"
                  }
                }
              }
            }
          },
          "suricata" : {
            "properties": {
              "active" : {
                "type" : "boolean"
              },
              "rules" : {
                "type": "nested",
                "properties": {
                  "id": {
                    "type" : "integer"
                  },
                  "details" : {
                    "type" : "text"
                  },
                  "active" : {
                    "type" : "boolean"
                  }
                }
              }
            }
          }
        }
      }
    } 
  }
}
```

## Default Document Agent Query
```
POST /agent-index/_doc/default
{
  "name" : "default",
  "active" : false,
  "interface" : "eth0",
  "interfaces" : ["eth0","eth1","eth2"],
  "ip" : "127.0.0.1",
  "services" : {
    "tshark" : {
      "active" : false,
      "rules" : [
        {
          "id": 1,
          "details": "tshark -i $interface",
          "active" : false
        }
      ]
    },
    "suricata" : {
      "active" : false,
      "rules" : [
        {
          "id": 1,
          "details": "suricata -i $interface",
          "active" : false
        },
        {
          "id": 2,
          "details": "suricata -i $interface",
          "active" : false
        }
      ]
    }
  }
}
```