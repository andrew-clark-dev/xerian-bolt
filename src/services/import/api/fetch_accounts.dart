  Future<CCAccountsResponse> fetch({required String? cursor}) async {
    final Map<String, dynamic> queryParameters = {};

    queryParameters['sort_by'] = 'created';

    if (cursor != null) queryParameters['cursor'] = cursor;

    queryParameters['include'] = [
      "default_split",
      "last_settlement",
      "number_of_purchases",
      "default_inventory_type",
      "default_terms",
      "last_item_entered",
      "number_of_items",
      "created_by",
      "last_activity",
      "locations",
      "recurring_fees",
      "tags"
    ];

    queryParameters['expand'] = ["created_by", "locations", "recurring_fees"];

    if (to != null) {
      queryParameters['created:lte'] = "${to!.toIso8601String()}Z";
    }

    final uri = Uri(
      scheme: 'https',
      host: 'api.consigncloud.com',
      path: 'api/v1/accounts',
      queryParameters: queryParameters,
    );
    client.options.headers["authorization"] = "Bearer $apiKey";
    safePrint('URI : $uri');
    try {
      final response = await client.getUri(uri);

      safePrint('Response : $response');
      return CCAccountsResponse.fromJson(response.data);
    } on Exception catch (e) {
      safePrint('Error : $e');
      rethrow;
    }
  }
}