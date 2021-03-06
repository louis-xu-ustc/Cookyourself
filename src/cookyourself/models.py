from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import datetime
from django.db.models import Max
from django.template import Template, Context, loader

# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User, related_name='profile',blank=True, null=True, on_delete=models.CASCADE)
    userid = models.CharField(max_length=1024, blank=True, null=True)
    rank = models.IntegerField(blank=True, null=True)
    photo = models.ImageField(upload_to='img/', blank=True, null=True)
    url = models.CharField(max_length=1024, blank=True, null=True)
    gender = models.CharField(max_length=128, blank=True, null=True)
    join_in = models.DateTimeField(default=timezone.now, blank=True)
    location = models.CharField(max_length=128, blank=True, null=True)
    favorites = models.ManyToManyField("Dish",blank=True)

    def __str__(self):
        return str(self.user)

class DishImage(models.Model):
    name = models.CharField(max_length=128)
    dish = models.ForeignKey('Dish', on_delete=models.CASCADE, related_name='image', blank=True, null=True)
    image = models.ImageField(upload_to='img/', blank=True, null=True)

    def __str__(self):
        return "IMG_" + self.name

class Ingredient(models.Model):
    name = models.CharField(max_length=128)
    price = models.FloatField(blank=True, null=True)

    def __str__(self):
        return self.name.decode('ascii', 'ignore')

class Style(models.Model):
    name = models.CharField(max_length=128)
    parent = models.ForeignKey("self", blank=True, null=True)

    def __str__(self):
        return self.name

class Dish(models.Model):
    name = models.CharField(max_length=128)
    description = models.TextField(max_length=1024, blank=True, null=True)
    style = models.ForeignKey(Style, blank=True, null=True)
    popularity = models.IntegerField(default=0)
    # Not sure whether it should be optinal field (Posts)
    ingredients = models.ManyToManyField(Ingredient,
                                         through='RelationBetweenDishIngredient',
                                         blank=True)
    calories = models.IntegerField(blank=True, null=True)
    # current date & time will be added.
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    @property
    def html(self):
        template= loader.get_template('recommend-dish.html')
        images = DishImage.objects.filter(dish=self)
        image=images[0].image
        context=Context({'dish': self, 'image': image})
        return template.render(context).replace('\"','\'').replace('\n','')

class Tutorial(models.Model):
    dish = models.OneToOneField(Dish, related_name='tutorial')
    video = models.CharField(max_length=128, blank=True, null=True)

    def __str__(self):
        return "Tutorial for " + str(self.dish)

class Instruction(models.Model):
    content = models.TextField(max_length=1024)
    tutorial = models.ForeignKey(Tutorial, blank=True, null=True)

    def __str__(self):
        return self.content

class Post(models.Model):
    author = models.ForeignKey(UserProfile, on_delete=models.CASCADE, blank=True, null=True)
    # Posts are related to particular dish
    dish = models.ForeignKey(Dish)
    content = models.TextField(max_length=1024)
    # current date & time will be added.
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "Post: " + self.content + ", by " + str(self.author)

    # Returns all recent additions and deletions to the to-do list.
    @staticmethod
    def get_posts(time="1970-01-01T00:00+00:00"):
        return Post.objects.filter(created_on__gt=time).distinct()
    
    @staticmethod
    def get_max_time():
        max_time = Post.objects.all().aggregate(Max('created_on'))['created_on__max']
        if not max_time:
            max_time = datetime(2000, 1, 6, 15, 8, 24, 78915, tzinfo=timezone.utc)
        return max_time
    
    @property
    def html(self):
        template= loader.get_template('post-list.html')
        context=Context({'post': self})
        return template.render(context).replace('\"','\'').replace('\n','')

class Message(models.Model):
    author = models.ForeignKey(UserProfile, related_name='message_author', 
                                      on_delete=models.CASCADE, blank=True, null=True)
    owner = models.ForeignKey(UserProfile, related_name='message_owner')
    content = models.TextField(max_length=1024)
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "Message: " + self.content + ", by " + str(self.author)

    @staticmethod
    def get_messages(time="1970-01-01T00:00+00:00"):
        return Message.objects.filter(created_on__gt=time).distinct()

    @property
    def html(self):
        template= loader.get_template('post-list.html')
        context=Context({'post': self})
        return template.render(context).replace('\"','\'').replace('\n','')
    @staticmethod
    def get_max_time():
        max_time = Message.objects.all().aggregate(Max('created_on'))['created_on__max']
        if not max_time:
            max_time = datetime(2000, 1, 6, 15, 8, 24, 78915, tzinfo=timezone.utc)
        return max_time

class Comment(models.Model):
    author = models.ForeignKey(UserProfile)
    content = models.TextField(max_length=1024)
    # One post may come with many comments
    post = models.ForeignKey(Post)
    # current date & time will be added.
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "Comment: " + content + ", by " + str(author)

class Unit(models.Model):
    name = models.CharField(max_length=128)
    rate = models.FloatField(blank=True, null=True)
    
    def __str_(self):
        return self.name

class RelationBetweenDishIngredient(models.Model):
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE, related_name='dish')
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE, related_name='ingredient')
    amount = models.FloatField(blank=True, null=True)
    unit = models.ForeignKey(Unit, blank=True, null=True) #original cup, bottle

    def __str__(self):
        dish = str(self.dish)
        amount = self.amount
        unit = self.unit.name if self.unit else None
        ingred = str(self.ingredient)
        if unit:
            return "{} requires {:.2f} {} of {}".format(dish, amount, unit, ingred)
        else:
            return "{} requires {:.2f} {}".format(dish, amount, ingred)

class Cart(models.Model):
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='cart')
    ingredients = models.ManyToManyField(Ingredient,
                                         through='RelationBetweenCartIngredient',
                                         blank=True)

    def __str__(self):
        return "{}'s cart".format(str(self.user))

class RelationBetweenCartIngredient(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='cart')
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE, related_name='ingre')
    amount = models.IntegerField(blank=True, null=True)
    unit = models.ForeignKey(Unit, blank=True, null=True)  #general unit, g

    def __str__(self):
        cart = str(self.cart)
        amount = self.amount
        unit = self.unit.name if self.unit else None
        ingred = str(self.ingredient)
        if unit:
            return "{} has {:.2f} {} of {}".format(cart, amount, unit, ingred)
        else:
            return "{} has {:.2f} {}".format(cart, amount, ingred)

